import Route from '@ember/routing/route';
import { service } from '@ember/service';
import fetch from 'fetch';

export default class ViewInfrastructuurElementRoute extends Route {
  @service fastboot;
  @service breadcrumbs;

  queryParams = {
    resource: { refreshModel: true },
  };

  async model({ resource }) {
    const query = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX infra: <https://data.vlaanderen.be/ns/openbaardomein/infrastructuur#>
PREFIX obd: <https://data.vlaanderen.be/ns/openbaardomein#>
PREFIX locn: <http://www.w3.org/ns/locn#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX fixme: <http://fixme.com#>
SELECT DISTINCT
  (REPLACE(STR(?type), STR(infra:), "") AS ?typeName)
  ?geometry
  ?materiaal
  ?materiaalLabel
  ?nauwkeurigheid
  ?nauwkeurigheidLabel
  ?niveau
  ?operationeleStatus
  ?operationeleStatusLabel
  ?bestuurlijkeStatus
  ?bestuurlijkeStatusLabel
  ?eigenaar
  ?beheerder
  ?altLabel
  ?sfWithin
  ?fietsdelen
  ?overdekt
  ?capaciteit
  ?afsluitbaar
  ?verplaatsbaar
  ?Begindatum
  ?Einddatum
  ?generatedAtTime
WHERE {
  <\${resource}> rdf:type ?type.
  <\${resource}> locn:geometry ?geometry.
  <\${resource}> obd:nauwkeurigheid ?nauwkeurigheid.
  <\${resource}> <http://stad.gent/id/applicatieprofiel/infrastructuurelementen#IE_Operationele_Status> ?operationeleStatus.
  <\${resource}> fixme:eigenaar ?eigenaar.
  <\${resource}> fixme:beheerder ?beheerder.

  FILTER(STRSTARTS(STR(?type), STR(infra:)))
  FILTER(REPLACE(STR(?type), STR(infra:), "") != "Infrastructuurelement")

  OPTIONAL {
    <\${resource}> infra:materiaal ?materiaal.
    GRAPH <http://stad.gent/vlag-labels> {
      ?materiaal skos:prefLabel ?materiaalLabel.
    }
  }

  OPTIONAL { ?nauwkeurigheid skos:prefLabel ?nauwkeurigheidLabel . }
  OPTIONAL { ?operationeleStatus skos:prefLabel ?operationeleStatusLabel . }

  OPTIONAL { <\${resource}> <http://stad.gent/id/applicatieprofiel/infrastructuurelementen#IE_Bestuurlijke_Status> ?bestuurlijkeStatus . }
  OPTIONAL { ?bestuurlijkeStatus skos:prefLabel ?bestuurlijkeStatusLabel . }

  OPTIONAL { <\${resource}> obd:niveau ?niveau . }
  OPTIONAL { <\${resource}> skos:altLabel ?altLabel . }
  OPTIONAL { <\${resource}> <http://www.opengis.net/ont/geosparql#sfWithin> ?sfWithin . }
  OPTIONAL { <\${resource}> infra:fietsdelen ?fietsdelen . }
  OPTIONAL { <\${resource}> infra:overdekt ?overdekt . }
  OPTIONAL { <\${resource}> infra:capaciteit ?capaciteit . }
  OPTIONAL { <\${resource}> infra:afsluitbaar ?afsluitbaar . }
  OPTIONAL { <\${resource}> infra:verplaatsbaar ?verplaatsbaar . }

  OPTIONAL { <\${resource}> obd:begindatum ?Begindatum . }
  OPTIONAL { <\${resource}> obd:einddatum ?Einddatum . }
  OPTIONAL { <\${resource}> prov:generatedAtTime ?generatedAtTime . }
}
LIMIT 1
`;
    let endpoint;
    if (this.fastboot.isFastBoot) {
      endpoint = `${window.BACKEND_URL || 'http://localhost'}/sparql/`;
    } else {
      endpoint = `/sparql/`;
    }
    const url = `${endpoint}?query=${encodeURIComponent(query)}`;
    const headers = {
      Accept: 'application/sparql-results+json',
    };

    const response = await fetch(url, { headers });
    const data = await response.json();
    const bindings = data.results.bindings[0] ?? {};

    const getValue = (field) => bindings[field]?.value || '';

    return {
      type: getValue('typeName'),
      geometry: getValue('geometry'),
      materiaal: getValue('materiaal'),
      materiaalLabel: getValue('materiaalLabel'),
      nauwkeurigheid: getValue('nauwkeurigheid'),
      nauwkeurigheidLabel: getValue('nauwkeurigheidLabel'),
      niveau: getValue('niveau'),
      operationeleStatus: getValue('operationeleStatus'),
      operationeleStatusLabel: getValue('operationeleStatusLabel'),
      bestuurlijkeStatus: getValue('bestuurlijkeStatus'),
      bestuurlijkeStatusLabel: getValue('bestuurlijkeStatusLabel'),
      eigenaar: getValue('eigenaar'),
      beheerder: getValue('beheerder'),
      altLabel: getValue('altLabel'),
      sfWithin: getValue('sfWithin'),
      fietsdelen: getValue('fietsdelen'),
      overdekt: getValue('overdekt'),
      capaciteit: getValue('capaciteit'),
      afsluitbaar: getValue('afsluitbaar'),
      verplaatsbaar: getValue('verplaatsbaar'),
      begindatum: getValue('Begindatum'),
      einddatum: getValue('Einddatum'),
      generatedAtTime: getValue('generatedAtTime'),
      resource: resource,
    };
  }

  async afterModel(model) {
    // Build breadcrumbs dynamically from the menu API using the RDF class URI
    const success = await this.breadcrumbs.buildFromClass(
      'https://data.vlaanderen.be/ns/openbaardomein/infrastructuur#Infrastructuurelement',
      model.altLabel || model.type || 'Infrastructuurelement',
    );

    // Fallback to hardcoded breadcrumbs if menu API fails
    if (!success) {
      console.warn('Failed to build breadcrumbs from menu API, using fallback');
      this.breadcrumbs.set([
        {
          label: 'Over Gent & stadsbestuur',
          url: '/nl/over-gent-stadsbestuur',
        },
        {
          label: 'Openbare Werken',
          url: '/nl/mobiliteit-openbare-werken',
        },
        { label: model.altLabel || model.type || 'Infrastructuurelement', url: null },
      ]);
    }
  }
}
