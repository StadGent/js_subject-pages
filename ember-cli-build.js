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
    }
  });

  // Comment/Uncomment this to enable/disable Embroider build
  // return app.toTree();

  const { Webpack } = require('@embroider/webpack');
  
  // Copy Gent styleguide assets during build
  const path = require('path');
  const fs = require('fs-extra');
  const sass = require('sass');
  
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

  // Compile additional SCSS files
  const includePaths = [
    path.join(__dirname, 'node_modules'),
    path.join(__dirname, 'node_modules/breakpoint-sass/stylesheets'),
    path.join(__dirname, 'node_modules/gent_styleguide/build/styleguide'),
    path.join(__dirname, 'app/styles')
  ];

  try {
    // Compile generic.scss
    const genericResult = sass.compile(path.join(__dirname, 'app/styles/generic.scss'), {
      includePaths: includePaths,
      style: 'compressed'
    });
    fs.writeFileSync(path.join(assetsDestination, 'generic.css'), genericResult.css);

    // Compile styleguide.scss  
    const styleguideResult = sass.compile(path.join(__dirname, 'app/styles/styleguide.scss'), {
      includePaths: includePaths,
      style: 'compressed'
    });
    fs.writeFileSync(path.join(assetsDestination, 'styleguide.css'), styleguideResult.css);
  } catch (error) {
    console.warn('Warning: Could not compile additional SCSS files:', error.message);
  }

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
