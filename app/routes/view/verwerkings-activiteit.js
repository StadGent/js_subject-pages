import Route from '@ember/routing/route';
import { service } from '@ember/service';
import fetch from 'fetch';

export default class ViewVerwerkingsActiviteitRoute extends Route {
  @service fastboot;

  queryParams = {
    resource: { refreshModel: true },
  };

  async model({ resource }) {
    const query = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
PREFIX dct: <http://purl.org/dc/terms/> 
PREFIX gdv: <http://stad.gent/data/ns/data-processing/> 
SELECT 
  ?verwerking 
  ?id  
  ?description 
  ?processor
  ?type 
  ?name 
  ?personalDataDescription 
  ?sensitivePersonalDataDescription 
  (group_concat(distinct ?personalData;separator=',') as ?personalData) 
  (group_concat(distinct ?sensitivePersonalData;separator=',') as ?sensitivePersonalData) 
  ?formal_framework 
  ?formal_framework_clarification 
  (group_concat(distinct ?grantee;separator=',') as ?grantees) 
  ?storagePeriod 
WHERE {
  <${resource}> a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit>; 
                dct:identifier ?id; 
                dct:description ?description; 
                dct:type/skos:prefLabel ?type; 
                dct:title ?name;  
                dct:temporal/dct:title ?storagePeriod;
                <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?formal_framework;
                <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor.
  OPTIONAL { <${resource}> gdv:verduidelijkingRechtsgrond ?formal_framework_clarification }
  OPTIONAL { <${resource}> <http://stad.gent/data/ns/data-processing/grantee>/skos:prefLabel ?grantee }
  OPTIONAL { <${resource}> <http://stad.gent/data/ns/data-processing/hasPersonalData>/dct:type/skos:prefLabel ?personalData } 
  OPTIONAL { <${resource}> <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dct:type/skos:prefLabel ?sensitivePersonalData } 
  OPTIONAL { <${resource}> <http://stad.gent/data/ns/data-processing/hasPersonalData>/dct:description ?personalDataDescription } 
  OPTIONAL { <${resource}> <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dct:description ?sensitivePersonalDataDescription } 
  BIND(<${resource}> as ?verwerking)
}
GROUP BY ?verwerking ?id ?description ?processor ?type ?name ?personalDataDescription ?sensitivePersonalDataDescription ?formal_framework ?formal_framework_clarification ?storagePeriod
`;
    console.log(query);
    let endpoint;
    if (this.fastboot.isFastBoot) {
      endpoint = `${window.BACKEND_URL || 'http://localhost'}/sparql/`;
    } else {
      endpoint = `/sparql/`;
    }
    const url = `${endpoint}?query=${encodeURIComponent(query)}`;
    console.log(url);
    const headers = {
      Accept: 'application/sparql-results+json',
    };

    const response = await fetch(url, { headers });
    const data = await response.json();
    const bindings = data.results.bindings[0] ?? {};

    const getValue = (field) => bindings[field]?.value || '';
    const getValueSplit = (field) => {
      const value = getValue(field);
      return value ? value.split(',') : [];
    };
    const model = {
      id: getValue('id'),
      title: getValue('name'),
      categorie: getValue('type'),
      verwerkers: getValue('processor'),
      rechtmatigheid: getValue('formal_framework'),
      rechtmatigheidVerduidelijking: getValue('formal_framework_clarification'),
      beschrijving: getValue('description'),
      bewaartermijn: getValue('storagePeriod'),
      persoonsgegevens: getValueSplit('personalData'),
      persoonsgegevensBeschrijving: getValue('personalDataDescription'),
      gevoeligePersoonsgegevens: getValueSplit('sensitivePersonalData'),
      gevoeligePersoonsgegevensBeschrijving: getValue('sensitivePersonalDataDescription'),
      toegangVerleend: getValueSplit('grantees'),
      resource: resource
    };

    return model;
  }
}
