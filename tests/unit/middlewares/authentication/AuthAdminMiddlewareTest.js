require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');
const sandbox = require('sinon').createSandbox();
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../../index');
const UsersTestData = require('../../../data/UsersTestData');
const JwtService = require('../../../../src/services/JwtService');
const UsersService = require('../../../../src/services/UsersService');

chai.use(chaiHttp);

const { APP_NAME } = process.env;

const BASE_API_PATH = `/api/${APP_NAME}`;
const BASE_API_USERS_PATH = `${BASE_API_PATH}/users`;
const ADMIN_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_admin: true })}`;
const NOT_ADMIN_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_admin: false })}`;

describe('Auth admin middleware', () => {
  beforeEach(() => {
    sandbox.stub(UsersService, 'create').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should throw an error if no authorization header is provided', async () => {
    const { status, body: { error: { message } } } = await chai.request(server)
      .post(BASE_API_USERS_PATH)
      .send(UsersTestData.createUserRequest);

    assert.equal(status, 401);
    assert.equal(message, 'Unauthorized');
  });

  it('Should throw an error if the token is malformed', async () => {
    const { status, body: { error: { message } } } = await chai.request(server)
      .post(BASE_API_USERS_PATH)
      .set('authorization', 'someToken')
      .send(UsersTestData.createUserRequest);

    assert.equal(status, 500);
    assert.equal(message, 'An error ocurred while trying to retrieve token info');
  });

  it('Should throw an error if it is NOT an admin', async () => {
    const { status, body: { error: { message } } } = await chai.request(server)
      .post(BASE_API_USERS_PATH)
      .set('authorization', NOT_ADMIN_TOKEN)
      .send(UsersTestData.createUserRequest);

    assert.equal(status, 403);
    assert.equal(message, 'Forbidden');
  });

  it('Should allow access if it is an admin', async () => {
    const { status } = await chai.request(server)
      .post(BASE_API_USERS_PATH)
      .set('authorization', ADMIN_TOKEN)
      .send(UsersTestData.createUserRequest);

    assert.equal(status, 201);
  });
});
