import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service intl;

  beforeModel() {
    // metis uses ember-intl, but defaults to en-us
    this.intl.setLocale(['nl-be']);
  }
}
