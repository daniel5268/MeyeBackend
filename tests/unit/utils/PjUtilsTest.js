const assert = require('assert');

const PjUtils = require('../../../src/utils/PjUtils');
const PjsTestData = require('../../data/PjsTestData');

describe('Pjs utils', () => {
  it('should calculate a pj spent xp', () => {
    const { basic, special, divine } = PjUtils.getPjSpentXp(PjsTestData.pj);

    const { basic: expectedBasicXp, special: expectedSpecialXp, divine: expectedDivineXp } = PjsTestData.pjSpentXp;
    assert.equal(basic, expectedBasicXp);
    assert.equal(special, expectedSpecialXp);
    assert.equal(divine, expectedDivineXp);
  });
});
