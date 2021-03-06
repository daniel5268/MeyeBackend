require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');

const UsersService = require('../../../src/services/UsersService');
const JwtService = require('../../../src/services/JwtService');
const DataBaseUtils = require('../../utils/DataBaseTestUtils');
const UsersTestData = require('../../data/UsersTestData');

describe('Users service', () => {
  beforeEach(async () => {
    await DataBaseUtils.cleanDataBase();
    await DataBaseUtils.insertInitialTestData();
  });

  describe('Sign in service', () => {
    it('Should return a valid token', async () => {
      const { token } = await UsersService.signIn(UsersTestData.signInInfo);
      const verifiedToken = JwtService.verify(token);
      const {
        exp, iat, id, iss, ...cleanedToken
      } = verifiedToken;

      assert.deepEqual(cleanedToken, UsersTestData.expectedVerifiedToken);
    });
  });
});
