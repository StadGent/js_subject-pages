import { module, test } from 'qunit';
import { setupTest } from 'frontend-centrale-vindplaats/tests/helpers';

module('Unit | Route | view/infrastructuur-element', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:view/infrastructuur-element');
    assert.ok(route);
  });
});
