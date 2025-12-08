# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fork of frontend-centrale-vindplaats, specifically adapted for **Stad Gent subject pages**. It's an Ember.js application for browsing Linked Open Data (LOD) as part of the "Lokale Besluiten als Gelinkt Open Data" (lblod) program. The application provides a SPARQL interface and dynamic RDF-based routing to explore government decision data for the City of Ghent.

**Data Flow**: `identifier => dispatcher => frontend => sparqlproxy` (proxies to https://stad.gent/sparql)

## Essential Commands

### Development
```bash
# Install dependencies
npm ci

# Start dev server (without backend, standalone)
ember serve

# Start with backend proxy (requires backend running on port 80)
ember serve --proxy http://localhost:80

# Build for production
npm run build
```

### Testing & Linting
```bash
# Run all tests and linting
npm test

# Run only Ember tests
npm run test:ember

# Lint all (JS, HBS, CSS)
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Architecture

### Routing System: ember-metis Integration

The application uses **ember-metis** addon for dynamic RDF-based routing. This is the core architectural pattern:

**Fallback Route Pattern** (`app/routes/fallback.js`):
- Any URL path not matching explicit routes gets caught by the fallback route
- The fallback route extends `ember-metis/routes/fallback.js`
- Path segments are automatically prefixed with `id/` before being processed
- Example: `/bestuursorganen/abc123` becomes `/id/bestuursorganen/abc123`
- ember-metis then fetches RDF data for that URI from the SPARQL endpoint

**Router Configuration** (`app/router.js`):
- Uses `fallbackRoute(this)` and `externalRoute(this)` from ember-metis
- `classRoute()` for typed RDF resources (e.g., VerwerkingsActiviteit)
- Order matters: explicit routes before `externalRoute()` before `fallbackRoute()`

**Example RDF Route**:
```javascript
classRoute(this, 'verwerkings-activiteit', {
  class: 'http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit',
});
```

### Dynamic Stylesheet System

The `dynamic-styles` service (`app/services/dynamic-styles.js`) manages route-specific stylesheets:
- Listens to `routeDidChange` events from the router
- Loads different stylesheets based on current route:
  - `view.*` routes → `styleguide.css` (Gent Styleguide)
  - `fallback` route → `generic.css`
- Dynamically injects/removes `<link>` elements in the document head
- Skips DOM manipulation during FastBoot (SSR) execution

### Build System

**Embroider** (modern Ember build system) is enabled with the following configuration:
- Uses `@embroider/webpack` for bundling
- Static flags: `staticAddonTrees`, `staticEmberSource`, `staticInvokables`
- Custom build step in `ember-cli-build.js`:
  - Copies Gent Styleguide assets (fonts, googlefonts, img, js) to `public/assets/`
  - Compiles `generic.scss` and `styleguide.scss` to CSS at build time
  - Asset source: `node_modules/gent_styleguide/build/styleguide`

### Configuration & Environment Variables

**Development** (`config/environment.js`):
- `EMBER_METIS_BASE_URL`: Base URL for RDF data (default: `https://qa.stad.gent/`)
- `EMBER_METIS_SERVICE_BASE`: Service base path (default: `/data`)

**Production** (replaced via templating):
- `{{METIS_BASE_URL}}`: Replaced at deployment time
- `{{METIS_SERVICE_BASE}}`: Replaced at deployment time
- `{{YASGUI_DEFAULT_QUERY}}`: SPARQL default query
- `{{YASGUI_EXTRA_PREFIXES}}`: Additional SPARQL prefixes as JSON

**Root URL**: Application is served from `/data/` path (see `rootURL` in config)

### SPARQL Interface

**YASGUI Integration** (`app/modifiers/yasgui.js`):
- Uses `@triply/yasgui` library for SPARQL query interface
- Lazy-loaded using `importSync()` from `@embroider/macros` to avoid FastBoot errors
- Configured endpoint: `/sparql`
- Default query configurable via environment variable or uses fallback query

### Internationalization

- Uses `ember-intl` addon (required by ember-metis)
- Locale set to `nl-be` (Belgian Dutch) in `app/routes/application.js`

### Deployment

**Multi-stage Docker Build** (`Dockerfile`):
1. Stage 1: Build using `madnificent/ember:5.12.0`
2. Stage 2: Serve static files using `semtech/static-file-service:0.2.0`
3. Custom nginx configuration from `nginx/` directory

**FastBoot**: Available via `Dockerfile.fastboot` for server-side rendering

## Key Dependencies

- `ember-metis`: RDF routing and linked data handling (custom fork: `github:MPParsley/ember-metis#dea5baf`)
- `@triply/yasgui`: SPARQL query interface
- `gent_styleguide`: City of Ghent design system
- `@appuniversum/ember-appuniversum`: Flemish government UI components
- `ember-cli-fastboot`: Server-side rendering support

## Development Notes

### Working with ember-metis

To generate a new RDF-based route:
```bash
ember generate rdf-route <route-name>
```

### Accessing Linked Data

When running with the backend, URIs follow this pattern:
- Full URI: `http://data.lblod.info/id/bestuursorganen/abc123`
- Access in app: `http://localhost:80/bestuursorganen/abc123`
- The `/id/` prefix is added automatically by the fallback route

### Build Asset Management

The build process (`ember-cli-build.js`) handles:
1. Copying Gent Styleguide static assets to `public/assets/`
2. Compiling SCSS files with custom include paths
3. Assets are served from `/data/assets/` in production (respecting `rootURL`)

## Stad Gent Specifics

This fork is customized for Stad Gent subject pages and includes:
- Integration with Gent Styleguide design system
- Custom styling for subject page presentation
- Dynamic stylesheet loading based on route type
- Configuration pointing to stad.gent infrastructure
