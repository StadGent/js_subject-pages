import { modifier } from 'ember-modifier';
import '@triply/yasgui/build/yasgui.min.css';
import env from '../config/environment';
import { importSync } from '@embroider/macros';

const defaultQuery =
  env.yasgui.defaultQuery !== '{{EMBER_YASGUI_DEFAULT_QUERY}}'
    ? env.yasgui.defaultQuery
    : `PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
PREFIX lblodlg: <http://data.lblod.info/vocabularies/leidinggevenden/>

SELECT DISTINCT ?type WHERE {
  ?s a ?type .
} LIMIT 10
`;

export default modifier(function yasgui(element /*, params, hash*/) {
  // We import Yasgui here since the eager import triggers errors in FastBoot
  // More information: https://github.com/embroider-build/embroider/issues/1809
  const Yasgui = importSync('@triply/yasgui').default;
  const yasgui = new Yasgui(element, {
    requestConfig: { endpoint: '/sparql' },
    autofocus: true,
  });
  yasgui.config.yasqe.value = defaultQuery;
  if (env.yasgui.extraPrefixes !== '{{YASGUI_EXTRA_PREFIXES}}')
    yasgui.config.yasqe.addPrefixes(JSON.parse(env.yasgui.extraPrefixes));
});
