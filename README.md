# Stad Gent Subject Pages

Fork of frontend-centrale-vindplaats, adapted for Stad Gent subject pages.

## Description

This is a frontend application for Stad Gent subject pages, forked from frontend-centrale-vindplaats as part of the <b> Lokale Besluiten als Gelinkt Open Data </b>  (lblod) Program. It is built on top of the [Ember.js](https://emberjs.com/) framework. It provides a SPARQL interface and routes that automatically get the URI info and corresponding labels of each URI. The frontend gets served by [fastboot](https://ember-fastboot.com/)

## Local development

Create a .env file

```
EMBER_METIS_BASE_URL: "https://qa.stad.gent/"
EMBER_METIS_SERVICE_BASE: "/data"
```

```sh
npm run start -- -proxy http://localhost
```
