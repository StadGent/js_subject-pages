import EmberRouter from '@ember/routing/router';
import config from 'frontend-centrale-vindplaats/config/environment';
import { fallbackRoute, externalRoute } from 'ember-metis';
import { classRoute } from 'ember-metis';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('sparql');
  this.route('view', function () {
    classRoute(this, 'verwerkings-activiteit', {
      class: 'http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit',
    });
  });

  externalRoute(this);
  fallbackRoute(this);

  this.route('legaal', function () {
    this.route('toegankelijkheidsverklaring');
    this.route('disclaimer');
    this.route('cookieverklaring');
  });
});
