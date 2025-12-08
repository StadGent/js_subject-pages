# Verwerkings Activiteit Embed Guide

## Overzicht

De verwerkings-activiteit kan nu als herbruikbaar component worden geëmbed in externe systemen zoals Drupal. Dit werkt vergelijkbaar met het embedden van YouTube videos.

## Gebruik in Ember

### Als component binnen Ember

```handlebars
<VerwerkingsActiviteitDisplay @data={{model}} />
```

De `@data` parameter verwacht een object met:
- `title`: Titel van de verwerking
- `beschrijving`: Beschrijving
- `categorie`: Type verwerking
- `verwerkers`: Verwerkende dienst
- `rechtmatigheid`: Rechtsgrond
- `persoonsgegevens`: Array van persoonsgegevens
- `gevoeligePersoonsgegevens`: Array van gevoelige persoonsgegevens
- `toegangVerleend`: Array van ontvangers
- `bewaartermijn`: Bewaartermijn

## Embed in externe systemen (Drupal, WordPress, etc.)

### Route voor embedding

Speciale embed route zonder header/footer/navigatie:
```
/data/embed/verwerkings-activiteit?resource=[RDF_URI]
```

### Voorbeeld URLs

**Development:**
```
https://qa.stad.gent/data/embed/verwerkings-activiteit?resource=http://data.lblod.info/id/verwerking/123
```

**Production:**
```
https://stad.gent/data/embed/verwerkings-activiteit?resource=http://data.lblod.info/id/verwerking/123
```

### Drupal Embedding

#### Optie 1: iFrame (Meest eenvoudig)

Voeg dit toe in een HTML paragraaf in Drupal:

```html
<iframe
  src="https://stad.gent/data/embed/verwerkings-activiteit?resource=http://data.lblod.info/id/verwerking/123"
  width="100%"
  height="800"
  frameborder="0"
  style="border: none; max-width: 100%;"
  title="Verwerkingsactiviteit details"
></iframe>
```

**Met automatische hoogte aanpassing:**

```html
<iframe
  id="verwerking-embed"
  src="https://stad.gent/data/embed/verwerkings-activiteit?resource=http://data.lblod.info/id/verwerking/123"
  width="100%"
  style="border: none; max-width: 100%;"
  title="Verwerkingsactiviteit details"
  onload="this.style.height=(this.contentWindow.document.body.scrollHeight+20)+'px';"
></iframe>
```

#### Optie 2: Drupal Field Formatter

Maak een custom field formatter in Drupal die de iframe automatisch genereert op basis van de resource URI.

**Template bestand: `field--verwerkings-activiteit.html.twig`**

```twig
{% for item in items %}
  <iframe
    src="https://stad.gent/data/embed/verwerkings-activiteit?resource={{ item.content }}"
    width="100%"
    height="800"
    frameborder="0"
    style="border: none; max-width: 100%;"
    title="Verwerkingsactiviteit details"
  ></iframe>
{% endfor %}
```

#### Optie 3: Drupal Module

Maak een custom Drupal module met een shortcode:

```php
/**
 * Implements hook_shortcode_info().
 */
function verwerking_embed_shortcode_info() {
  return [
    'verwerking' => [
      'title' => t('Verwerkingsactiviteit Embed'),
      'description' => t('Embed a verwerkingsactiviteit from the LOD system'),
      'process callback' => 'verwerking_embed_shortcode_process',
      'attributes callback' => 'verwerking_embed_shortcode_attributes',
    ],
  ];
}

/**
 * Shortcode attributes callback.
 */
function verwerking_embed_shortcode_attributes($attrs, $text) {
  return [
    'resource' => '',
    'height' => '800',
  ];
}

/**
 * Shortcode process callback.
 */
function verwerking_embed_shortcode_process($attrs, $text) {
  $resource = $attrs['resource'];
  $height = $attrs['height'];

  if (empty($resource)) {
    return '';
  }

  $url = 'https://stad.gent/data/embed/verwerkings-activiteit?resource=' . urlencode($resource);

  return '<iframe src="' . $url . '" width="100%" height="' . $height . '" frameborder="0" style="border: none; max-width: 100%;" title="Verwerkingsactiviteit details"></iframe>';
}
```

**Gebruik in Drupal content:**

```
[verwerking resource="http://data.lblod.info/id/verwerking/123"]
```

### WordPress Embedding

Voor WordPress, voeg dit toe aan een HTML block:

```html
<iframe
  src="https://stad.gent/data/embed/verwerkings-activiteit?resource=http://data.lblod.info/id/verwerking/123"
  width="100%"
  height="800"
  frameborder="0"
  style="border: none; max-width: 100%;"
  title="Verwerkingsactiviteit details"
></iframe>
```

### Styling aanpassen

De embed template gebruikt minimale styling. Voor custom styling:

1. **Via query parameter** (toekomstige feature):
   ```
   ?resource=...&theme=compact
   ```

2. **Via CSS in parent page**:
   ```css
   iframe {
     border: 1px solid #ccc;
     border-radius: 4px;
     box-shadow: 0 2px 4px rgba(0,0,0,0.1);
   }
   ```

## Veiligheid

- De embed route is read-only
- Geen authenticatie vereist voor publieke verwerkingen
- CSP headers moeten toestaan dat de embed geladen wordt in iframes
- CORS moet geconfigureerd zijn voor cross-origin requests

## Troubleshooting

**Iframe laadt niet:**
- Check of de resource URI correct is
- Controleer of de SPARQL endpoint bereikbaar is
- Verifieer CSP/CORS settings

**Styling ziet er verkeerd uit:**
- Zorg dat de parent page geen conflicterende CSS heeft
- Check browser console voor errors

**Hoogte is niet correct:**
- Gebruik de auto-height JavaScript in het iframe voorbeeld
- Of stel een vaste hoogte in die past bij je content

## API Endpoint

Voor programmatische toegang tot de data (JSON):

```
GET /sparql?query=[SPARQL_QUERY]
Accept: application/sparql-results+json
```

Dit kan gebruikt worden om custom embeddings te bouwen in andere frameworks.
