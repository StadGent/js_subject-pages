import ParentFallbackRoute from 'ember-metis/routes/fallback.js';
import { service } from '@ember/service';

export default class FallbackRoute extends ParentFallbackRoute {
  @service breadcrumbs;
  @service menu;

  async model(args) {
    const { path } = args;
    args.path = `id/${path}`;
    return super.model(args);
  }

  async afterModel(model) {
    // Helper functie om een property waarde te vinden in de RDF triples
    const findTripleValue = (predicate) => {
      if (model.directed?.triples) {
        const triple = model.directed.triples.find(
          t => t.predicate === predicate
        );
        return triple?.object?.value;
      }
      return null;
    };

    // Helper functie om alle waarden voor een predicate te vinden
    const findAllTripleValues = (predicate) => {
      if (model.directed?.triples) {
        return model.directed.triples
          .filter(t => t.predicate === predicate)
          .map(t => t.object?.value)
          .filter(Boolean);
      }
      return [];
    };

    // Probeer verschillende properties voor de titel
    let title = findTripleValue('http://schema.org/name')
      || findTripleValue('http://schema.org/headline')
      || model.directed?.subject
      || 'Linked Data';

    // Detecteer RDF type(s) van deze resource
    const rdfTypes = findAllTripleValues('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    console.log('Detected RDF types:', rdfTypes);

    // Verzamel alle mogelijke breadcrumb paden voor de verschillende types
    const breadcrumbCandidates = [];
    for (const rdfType of rdfTypes) {
      const menuItems = await this.menu.getBreadcrumbsForClass(rdfType);
      if (menuItems && menuItems.length > 0) {
        breadcrumbCandidates.push({
          type: rdfType,
          items: menuItems,
          depth: menuItems.length
        });
        console.log(`Found breadcrumbs for ${rdfType}:`, menuItems, `(depth: ${menuItems.length})`);
      }
    }

    // Kies de meest specifieke breadcrumb (langste hiërarchie)
    if (breadcrumbCandidates.length > 0) {
      breadcrumbCandidates.sort((a, b) => b.depth - a.depth);
      const best = breadcrumbCandidates[0];
      console.log(`Using breadcrumbs for type: ${best.type} (depth: ${best.depth})`);

      const breadcrumbs = [...best.items, { label: title, url: null }];
      this.breadcrumbs.set(breadcrumbs);
    } else {
      // Als geen breadcrumbs gevonden, gebruik generieke fallback
      console.log('No breadcrumbs found for types, using generic fallback');
      this.breadcrumbs.set([
        { label: title, url: null }
      ]);
    }
  }
}
