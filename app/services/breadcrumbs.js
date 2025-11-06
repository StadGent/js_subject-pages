import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class BreadcrumbsService extends Service {
  @service menu;

  @tracked items = [];

  set(breadcrumbs) {
    this.items = breadcrumbs;
  }

  clear() {
    this.items = [];
  }

  /**
   * Build breadcrumbs from a RDF class URI and page title
   * @param {string} classUri - The RDF class URI
   * @param {string} pageTitle - The title of the current page
   * @returns {boolean} True if successful, false if menu API failed
   */
  async buildFromClass(classUri, pageTitle) {
    const menuItems = await this.menu.getBreadcrumbsForClass(classUri);

    // If no menu items found, return false to indicate failure
    if (!menuItems || menuItems.length === 0) {
      console.warn('No menu items found for class:', classUri);
      return false;
    }

    // Add the page title as the last item (without URL)
    const breadcrumbs = [...menuItems, { label: pageTitle, url: null }];

    this.set(breadcrumbs);
    return true;
  }
}
