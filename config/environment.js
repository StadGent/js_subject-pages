'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'frontend-centrale-vindplaats',
    environment,
    rootURL: '/data/',
    locationType: 'history',
    metis: {
      routes: {},
      baseUrl: '{{METIS_BASE_URL}}',
      serviceBase: '{{METIS_SERVICE_BASE}}',
    },
    yasgui: {
      // NOTE: look at app/modifiers/yasgui.js when changing this variable
      defaultQuery: '{{YASGUI_DEFAULT_QUERY}}',
      extraPrefixes: '{{YASGUI_EXTRA_PREFIXES}}',
    },
    menu: {
      linksetUrl: '{{MENU_LINKSET_URL}}',
    },
    fastboot: {
      hostWhitelist: [/^localhost(:[0-9]*)?/, 'localhost', /^.*$/],
    },
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.metis.baseUrl = process.env.EMBER_METIS_BASE_URL || 'https://qa.stad.gent/';
    ENV.metis.serviceBase = process.env.EMBER_METIS_SERVICE_BASE || '/data';
    // Use local static JSON file by default in development
    // Can be overridden with EMBER_MENU_LINKSET_URL env variable
    // Note: public files are served with serviceBase prefix
    ENV.menu.linksetUrl = process.env.EMBER_MENU_LINKSET_URL || `${ENV.metis.serviceBase}/menu-lod-linkset.json`;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
