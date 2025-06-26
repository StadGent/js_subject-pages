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
SELECT ?title ?type ?verwerker ?grond ?desc ?period
WHERE {
  <${resource}> dct:title ?title;
                dct:type/skos:prefLabel ?type;
                <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?verwerker;
                <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?grond.
  OPTIONAL {
    <${resource}> dct:description ?desc.
  }
  OPTIONAL {
    <${resource}> dct:temporal/dct:title ?period.
  }
}
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
    return {
      categorie: getValue('type'),
      title: getValue('title'),
      verwerkers: getValue('verwerker'),
      rechtmatigheid: getValue('grond'),
      beschrijving: getValue('desc'),
      bewaartermijn: getValue('period'),
      resource: resource
    };
  }
}
