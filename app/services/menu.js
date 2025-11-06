import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';
import config from 'frontend-centrale-vindplaats/config/environment';

export default class MenuService extends Service {
  @service fastboot;

  @tracked linksetData = null;
  @tracked isLoading = false;

  get menuUrl() {
    if (this.fastboot.isFastBoot) {
      return `${window.BACKEND_URL || 'http://localhost'}/nl/system/menu/lod/linkset`;
    }

    // Use the configured menu linkset URL from environment
    return config.menu.linksetUrl;
  }

  async fetchLinkset() {
    if (this.linksetData) {
      return this.linksetData;
    }

    if (this.isLoading) {
      // Wait for existing fetch to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.fetchLinkset();
    }

    this.isLoading = true;
    try {
      const headers = {
        'Accept': 'application/json'
      };

      console.log('Fetching menu from:', this.menuUrl);
      const response = await fetch(this.menuUrl, { headers });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        console.error(`Failed to fetch menu: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      console.log('Menu data loaded successfully:', data);
      this.linksetData = data;
      return data;
    } catch (error) {
      console.error('Failed to fetch menu linkset:', error);
      console.error('Error details:', error.message, error.stack);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Find breadcrumb items for a given RDF class URI
   * @param {string} classUri - The RDF class URI (e.g., 'http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit')
   * @returns {Array} Array of breadcrumb items with { label, url }
   */
  async getBreadcrumbsForClass(classUri) {
    console.log('getBreadcrumbsForClass called with:', classUri);

    const linkset = await this.fetchLinkset();
    console.log('Linkset data:', linkset);

    if (!linkset?.linkset?.[0]?.item) {
      console.log('No linkset items found');
      return [];
    }

    const items = linkset.linkset[0].item;
    console.log('Menu items:', items);

    // Find the item that matches the class URI
    const matchingItem = items.find(item => item.href === classUri);
    console.log('Matching item for class:', matchingItem);

    if (!matchingItem) {
      console.log('No matching item found for classUri:', classUri);
      return [];
    }

    // Get the hierarchy depth
    const hierarchyDepth = matchingItem.hierarchy.length;
    console.log('Hierarchy depth:', hierarchyDepth);
    console.log('Target hierarchy:', matchingItem.hierarchy);

    // Find all items that are direct ancestors (their hierarchy is a prefix of the target)
    const ancestors = items.filter(item => {
      if (item.hierarchy.length >= hierarchyDepth) {
        return false; // Not an ancestor
      }
      if (item.hierarchy.length === 0) {
        return false; // Skip empty hierarchies
      }
      if (item.href === classUri) {
        return false; // Skip self
      }

      // Check if this item's hierarchy is a prefix of the target hierarchy
      const isPrefix = item.hierarchy.every((value, index) => {
        return matchingItem.hierarchy[index] === value;
      });

      return isPrefix;
    });
    console.log('Ancestors found:', ancestors);

    // Sort by hierarchy depth
    ancestors.sort((a, b) => a.hierarchy.length - b.hierarchy.length);

    // Convert to breadcrumb format (excluding the matching class item itself)
    const breadcrumbs = ancestors.map(item => ({
      label: item.title,
      url: item.href
    }));
    console.log('Final breadcrumbs:', breadcrumbs);

    return breadcrumbs;
  }
}
