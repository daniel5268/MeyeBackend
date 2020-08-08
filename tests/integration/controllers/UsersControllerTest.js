require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../index');

chai.use(chaiHttp);

const DataBaseUtils = require('../../utils/DataBaseTestUtils');
const UsersTestData = require('../../data/UsersTestData');

const { APP_NAME } = process.env;

const BASE_API_PATH = `/api/${APP_NAME}`;

describe('Users controller test', () => {
  beforeEach(async () => {
    await DataBaseUtils.cleanDataBase();
    await DataBaseUtils.insertInitialTestData();
  });

  describe('Sign in test', () => {
    it('Should throw an error if the user does NOT exists', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .post(`${BASE_API_PATH}/sign-in`)
        .send(UsersTestData.notExistingUserSignInRequest);

      const { username } = UsersTestData.notExistingUserSignInRequest;

      assert.equal(status, 404);
      assert.equal(message, `User with username: ${username} not found`);
    });

    it('Should throw an error if invalid credentials are provided', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .post(`${BASE_API_PATH}/sign-in`)
        .send(UsersTestData.wrongCredentialsSignInRequest);

      assert.equal(status, 401);
      assert.equal(message, 'Unauthorized');
    });

    it('Should work correctly', async () => {
      const { status, body: { token } } = await chai.request(server)
        .post(`${BASE_API_PATH}/sign-in`)
        .send(UsersTestData.signInInfo);

      assert.equal(status, 200);
      assert(!!token);
    });
  });
});
