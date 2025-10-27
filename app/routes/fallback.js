import ParentFallbackRoute from 'ember-metis/routes/fallback.js';
import { service } from '@ember/service';

export default class FallbackRoute extends ParentFallbackRoute {
  @service breadcrumbs;

  async model(args) {
    const { path } = args;
    args.path = `id/${path}`;
    return super.model(args);
  }

  afterModel(model) {
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

    // Probeer verschillende properties in volgorde van voorkeur
    let title = findTripleValue('http://schema.org/name')
      || findTripleValue('http://schema.org/headline')
      || model.directed?.subject
      || 'Linked Data';

    // Generieke breadcrumb voor fallback routes
    this.breadcrumbs.set([
      { label: title, url: null }
    ]);
  }
}
