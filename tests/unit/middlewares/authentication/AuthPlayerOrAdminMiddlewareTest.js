require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');
const sandbox = require('sinon').createSandbox();
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../../index');
const JwtService = require('../../../../src/services/JwtService');
const PjsService = require('../../../../src/services/PjsService');
const UsersTestData = require('../../../data/UsersTestData');
const PjsTestData = require('../../../data/PjsTestData');

chai.use(chaiHttp);

const { APP_NAME } = process.env;

const TEST_PATH = `/api/${APP_NAME}/users/1/pjs`;
const PLAYER_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_player: true, id: 1 })}`;
const WRONG_PLAYER_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_player: true, id: 2 })}`;
const MASTER_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_master: true, id: 1 })}`;
const FORBIDDEN_TOKEN = `bearer ${JwtService.sign(UsersTestData.userVerifiedToken)}`;

describe('Auth master or player middleware', () => {
  beforeEach(() => {
    sandbox.stub(PjsService, 'create').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should throw an error if no authorization header is provided', async () => {
    const { status, body: { error: { message } } } = await chai.request(server)
      .post(TEST_PATH)
      .send(PjsTestData.createPjBody);

    assert.equal(status, 401);
    assert.equal(message, 'Unauthorized');
  });

  it('Should throw an error if the token is malformed', async () => {
    const { status, body: { error: { message } } } = await chai.request(server)
      .post(TEST_PATH)
      .set('authorization', 'someToken')
      .send(PjsTestData.createPjBody);

    assert.equal(status, 500);
    assert.equal(message, 'An error ocurred while trying to retrieve token info');
  });

  it('Should throw an error if it is NOT player nor master', async () => {
    const { status, body: { error: { message } } } = await chai.request(server)
      .post(TEST_PATH)
      .set('authorization', FORBIDDEN_TOKEN)
      .send(PjsTestData.createPjBody);

    assert.equal(status, 403);
    assert.equal(message, 'Forbidden');
  });

  it('Should throw an error if its a player but its not the user in the path', async () => {
    const { status, body: { error: { message } } } = await chai.request(server)
      .post(TEST_PATH)
      .set('authorization', WRONG_PLAYER_TOKEN)
      .send(PjsTestData.createPjBody);

    assert.equal(status, 403);
    assert.equal(message, 'Forbidden');
  });

  it('Should allow access if it is a player and its the user in the path', async () => {
    const { status } = await chai.request(server)
      .post(TEST_PATH)
      .set('authorization', PLAYER_TOKEN)
      .send(PjsTestData.createPjBody);

    assert.equal(status, 201);
  });

  it('Should allow access if it is a master', async () => {
    const { status } = await chai.request(server)
      .post(TEST_PATH)
      .set('authorization', MASTER_TOKEN)
      .send(PjsTestData.createPjBody);

    assert.equal(status, 201);
  });
});
