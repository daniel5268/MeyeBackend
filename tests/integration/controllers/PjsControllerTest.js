require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const server = require('../../../index');

chai.use(chaiHttp);

const DataBaseUtils = require('../../utils/DataBaseTestUtils');
const PjUtils = require('../../../src/utils/PjUtils');
const { PJS, XP_ASSIGNATIONS } = require('../../../src/repositories/TableNames');
const {
  [PJS]: PjsRepository,
  [XP_ASSIGNATIONS]: XpAssignationsRepository,
} = require('../../../src/repositories/GenericRepository');
const JwtService = require('../../../src/services/JwtService');
const UsersTestData = require('../../data/UsersTestData');
const PjsTestData = require('../../data/PjsTestData');

const { APP_NAME } = process.env;

const BASE_API_PATH = `/api/${APP_NAME}`;
const BASE_API_USERS_PATH = `${BASE_API_PATH}/users`;
const PLAYER_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_player: true, id: 1 })}`;
const MASTER_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_master: true, id: 1 })}`;

describe('Pjs controller', () => {
  let userId;
  let pjId;

  beforeEach(async () => {
    await DataBaseUtils.cleanDataBase();
    ({ user_id: userId, pj_id: pjId } = await DataBaseUtils.insertInitialTestData());
    sandbox.spy(PjUtils, 'getPjValidStates');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Create pj', () => {
    it('Should throw an error if the user does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .post(`${BASE_API_USERS_PATH}/123/pjs`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.createPjRequest);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should create a pj', async () => {
      const { status, body: { id: createdPjId } } = await chai.request(server)
        .post(`${BASE_API_USERS_PATH}/${userId}/pjs`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.createPjRequest);

      assert.equal(status, 201);
      const foundPj = await PjsRepository.findOne({ id: createdPjId });
      const cleanedPj = DataBaseUtils.cleanRecord(foundPj);

      assert.deepEqual(cleanedPj, { ...PjsTestData.expectedCreatedPJ, user_id: userId });
    });
  });

  describe('Update pj', () => {
    it('Should throw an error if the user does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/123/pjs/123`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.updatePjRequest);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should throw an error if the pj does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}/pjs/123`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.updatePjRequest);

      assert.equal(status, 404);
      assert.equal(message, 'Pj with id: 123 not found');
    });

    it('Should throw an error if the pj basic xp is not enough', async () => {
      const insufficientBasicXpAssignations = PjsTestData.insufficientBasicXpAssignations
        .map((assignation) => ({ ...assignation, user_id: userId, pj_id: pjId }));
      const enoughSpecialXpAssignations = PjsTestData.enoughSpecialXpAssignations
        .map((assignation) => ({ ...assignation, user_id: userId, pj_id: pjId }));

      await XpAssignationsRepository.insert(insufficientBasicXpAssignations);
      await XpAssignationsRepository.insert(enoughSpecialXpAssignations);

      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}/pjs/${pjId}`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.updatePjRequest);

      assert.equal(status, 400);
      assert.equal(message, JSON.stringify({ ...PjsTestData.pjInvalidState, basic_xp_valid: false }));
    });

    it('Should throw an error if the pj special xp is not enough', async () => {
      const enoughBasicXpAssignations = PjsTestData.enoughBasicXpAssignations
        .map((assignation) => ({ ...assignation, user_id: userId, pj_id: pjId }));
      const insufficientSpecialXpAssignations = PjsTestData.insufficientSpecialXpAssignations
        .map((assignation) => ({ ...assignation, user_id: userId, pj_id: pjId }));

      await XpAssignationsRepository.insert(enoughBasicXpAssignations);
      await XpAssignationsRepository.insert(insufficientSpecialXpAssignations);

      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}/pjs/${pjId}`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.updatePjRequest);

      assert.equal(status, 400);
      assert.equal(message, JSON.stringify({ ...PjsTestData.pjInvalidState, special_xp_valid: false }));
    });

    it('Should not validate pj state if no stats are provided', async () => {
      const { status } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}/pjs/${pjId}`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.updatePjRequestWithoutStats);

      assert.equal(status, 200);
      assert(PjUtils.getPjValidStates.notCalled);
    });

    it('Should update a pj', async () => {
      const enoughBasicXpAssignations = PjsTestData.enoughBasicXpAssignations
        .map((assignation) => ({ ...assignation, user_id: userId, pj_id: pjId }));
      const enoughSpecialXpAssignations = PjsTestData.enoughSpecialXpAssignations
        .map((assignation) => ({ ...assignation, user_id: userId, pj_id: pjId }));

      await XpAssignationsRepository.insert(enoughBasicXpAssignations);
      await XpAssignationsRepository.insert(enoughSpecialXpAssignations);

      const { status, body } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}/pjs/${pjId}`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.updatePjRequest);

      const cleanedPj = DataBaseUtils.cleanRecord(body);

      assert.deepEqual(cleanedPj, { ...PjsTestData.expectedUpdatedPj, user_id: userId });
      assert.equal(status, 200);
    });
  });
});
