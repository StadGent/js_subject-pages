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
    sassOptions: {
      includePaths: [
        'node_modules/breakpoint-sass/stylesheets',
        'node_modules/gent_styleguide/build/styleguide'
      ]
    },
  });

  // Comment/Uncomment this to enable/disable Embroider build
  // return app.toTree();

  const { Webpack } = require('@embroider/webpack');
  
  // Copy Gent styleguide assets during build
  const path = require('path');
  const fs = require('fs-extra');
  
  const styleguideSource = path.join(__dirname, 'node_modules/gent_styleguide/build/styleguide');
  const assetsDestination = path.join(__dirname, 'public/assets');
  
  // Copy all gent_styleguide assets (fonts, googlefonts, img, js)
  const assetFolders = ['fonts', 'googlefonts', 'img', 'js'];
  
  assetFolders.forEach(folder => {
    const sourceFolder = path.join(styleguideSource, folder);
    const destFolder = path.join(assetsDestination, folder);
    
    if (fs.existsSync(sourceFolder)) {
      fs.ensureDirSync(destFolder);
      fs.copySync(sourceFolder, destFolder);
    }
  });

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
