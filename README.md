# frontend-centrale-vindplaats

  <br>

## Table of content


* [Description](#description)
* [Development with backend](#development-with-backend)
* [Development without backend](#development-without-backend)
* [How to visit routes](#how-to-visit-routes)
* [Generating custom rdf-routes](#generating-custom-rdf-routes)
* [Config](#config)
* [Relavant Addons](#relavant-addons)
<br>

## Description

This is the frontend of the centrale vindplaats page as part of the <b> Lokale Besluiten als Gelinkt Open Data </b>  (lblod) Program. It is build on top of the [Ember.js](https://emberjs.com/) framework. It provides a sparql interface and routes that automatically get the uri info and corresponding labels of each uri. The frontend gets served by [fastboot](https://ember-fastboot.com/)

<br>

## Development with backend

For development where fetching data about a uri is important you will need to run the app-centrale-vindplaats in the back.

* Clone the app-centrale-vindplaats repository
``` git clone https://github.com/lblod/app-centrale-vindplaats.git ```

* Remove the frontend service from both the docker-compose.yml as the docker-compose.dev.yml files inside the app-centrale-vindplaats folder you just cloned
<small> This because we will use this frontend instead </small>

* Start your backend
```docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d```

* Clone this repository
``` git clone https://github.com/lblod/frontend-centrale-vindplaats.git ```

*  Move into the directory
``` cd frontend-centrale-vindplaats ```

* Serve the frontend through a proxy
``` ember serve --proxy http://localhost:80 ``` <small> (will automatically serve through fastboot)</small>

* Visit localhost
``` http://localhost:80```

<br>

## Development without backend

* Clone this repository
``` git clone https://github.com/lblod/frontend-centrale-vindplaats.git ```

*  Move into the directory
``` cd frontend-centrale-vindplaats ```

* Serve the frontend through a proxy <small> (will automatically serve through fastboot)</small>
``` ember serve ```

* Visit localhost
``` http://localhost:80```

<br>

## How to visit routes

When you first visit the `http://localhost:80` you will be redirected to a sparql interface. This will already have performed a search query that presents you with data from the database. ( Only in case your migrations folder and therefor Triplestore is populated with data & have the backend running ). If you are running the app locally and you want to get more information about a subject then you will have to copy part of the url into your browsers searchbar.

### Example

 * The results of on the sparql route page will probably be displayed like so:
   ```Subject-uri | predicate-uri | object-uri```

 * Let's take an arbitrary subject-uri as an example
```<http://data.lblod.info/id/bestuursorganen/293a6433b88c65f11071c86fff60459cfa80c6623984e9da9757a6e4c648c079>```

 * Trim of the the protocol, subdomain and domain name so you only have the path left
    ```/id/bestuursorganen/293a6433b88c65f11071c86fff60459cfa80c6623984e9da9757a6e4c648c079>```

 *  Inside your searchbar, prepend that path by ``` http://localhost:80``` and hit enter
     ```http://localhost:80/id/bestuursorganen/293a6433b88c65f11071c86fff60459cfa80c6623984e9da9757a6e4c648c079>```

 If info exists about that subject then you should be met by a table with data about that uri, both direct and invers. The [resource-label](https://github.com/lblod/resource-label-service) service automatically looks for labels & description for each uri and displays them if they exists. You can now just simply click through each link that starts with ```http://data.lblod.info/``` to get more information of the clicked uri inside this frontend or click on any other link to get redirected outside it.

<br>

## Generating custom rdf-routes
The metis addon provides cli commands similar to generic ember-router commands (e.g. generate , destroy...)
Instead of writing ``` ember generate route person ``` You can generate an rdf route like so : ``` ember generate rdf-route person ```. You can find more info in the [readme](https://github.com/redpencilio/ember-metis) file of the metis addon.

<br>

## Config

In your ``` /frontend-centrale-vindplaats/config/environment ``` you should see a metis object under ENV where you can change the <b> baseUrl </b> <br>
By default you will the baseUrl is set to ``` EMBER_METIS_BASE_URL ```. This is a special string that, when using docker-compose, will be replaced by the environment variable BASE_URL ( see [app-centrale-vindplaats](https://github.com/lblod/app-centrale-vindplaats#environment) ) for more information.
To overide this behavior you simply replace the baseUrl value in your environment.js file by any other URL.

## Relavant Addons

#### [Ember-metis](https://github.com/lblod/app-centrale-vindplaats#ember-metis)

The frontend uses our  metis  addon to take care of the routes and calls to the coresponding info and labels.

#### [@triply/yasgui](https://github.com/TriplyDB/yasgui)

The  yasgui  addon that gives you a sparql interface when visiting  `http://localhost/sparql`  .

#### [Ember-fastboot](https://github.com/lblod/app-centrale-vindplaats#ember-fastboot)

The ember-fastboot addon makes it possible to render the page in nodejs.
