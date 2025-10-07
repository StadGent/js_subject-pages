import ParentFallbackRoute from 'ember-metis/routes/fallback.js';

export default class FallbackRoute extends ParentFallbackRoute {
  async model(args) {
    const { path } = args;
    args.path = `id/${path}`;
    return super.model(args);
  }
}
