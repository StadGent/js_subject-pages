import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class BreadcrumbsService extends Service {
  @tracked items = [];

  set(breadcrumbs) {
    this.items = breadcrumbs;
  }

  clear() {
    this.items = [];
  }
}
