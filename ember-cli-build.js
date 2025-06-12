'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // This is needed to make ember-fetch work with the `staticEmberSource` flag.
    // TODO: remove this once ember-fetch is removed.
    'ember-fetch': {
      preferNative: true,
      nativePromise: true,
    },
  });

  // Comment/Uncomment this to enable/disable Embroider build
  // return app.toTree();

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticInvokables: true,
    staticEmberSource: true,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
