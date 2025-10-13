import Service from '@ember/service';
import { service } from '@ember/service';
import { getOwner } from '@ember/application';

export default class DynamicStylesService extends Service {
  @service router;
  @service fastboot;
  
  currentStylesheet = null;

  constructor() {
    super(...arguments);
    this.config = getOwner(this).resolveRegistration('config:environment');
  }

  init() {
    super.init(...arguments);
    this.router.on('routeDidChange', this, this.updateStylesheet);
  }

  willDestroy() {
    this.router.off('routeDidChange', this, this.updateStylesheet);
    this.removeCurrentStylesheet();
    super.willDestroy(...arguments);
  }

  updateStylesheet() {
    const currentRouteName = this.router.currentRouteName;
    let stylesheetPath = null;
    
    const serviceBase = this.config.metis.serviceBase || '/data';

    if (currentRouteName && currentRouteName.startsWith('view.')) {
      console.log('Loading styleguide stylesheet for view route');
      stylesheetPath = `${serviceBase}/assets/styleguide.css`;
    } else if (currentRouteName && currentRouteName.startsWith('fallback')) {
      console.log('Loading generic stylesheet for fallback route');
      stylesheetPath = `${serviceBase}/assets/generic.css`;
    }

    this.loadStylesheet(stylesheetPath);
  }

  loadStylesheet(path) {
    // Skip in FastBoot (server-side rendering)
    if (this.fastboot.isFastBoot) {
      return;
    }

    // Remove current stylesheet if it exists
    this.removeCurrentStylesheet();

    if (!path) return;

    // Create and append new stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    link.id = 'dynamic-route-styles';
    
    document.head.appendChild(link);
    this.currentStylesheet = link;
  }

  removeCurrentStylesheet() {
    // Skip in FastBoot (server-side rendering)
    if (this.fastboot.isFastBoot) {
      return;
    }

    if (this.currentStylesheet) {
      this.currentStylesheet.remove();
      this.currentStylesheet = null;
    }
  }
}