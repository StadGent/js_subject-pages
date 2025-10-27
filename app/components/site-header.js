import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class SiteHeaderComponent extends Component {
  @service breadcrumbs;

  get hasBreadcrumbs() {
    return this.breadcrumbs.items.length > 0;
  }

  get breadcrumbItems() {
    return this.breadcrumbs.items;
  }
}
