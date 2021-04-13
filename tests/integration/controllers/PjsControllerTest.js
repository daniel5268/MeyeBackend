require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const server = require('../../../index');

chai.use(chaiHttp);

const DataBaseUtils = require('../../utils/DataBaseTestUtils');
const PjUtils = require('../../../src/utils/PjUtils');
const { PJS, XP_ASSIGNATIONS, SPECIALTY_OWNERSHIPS } = require('../../../src/repositories/TableNames');
const {
  [PJS]: PjsRepository,
  [XP_ASSIGNATIONS]: XpAssignationsRepository,
  [SPECIALTY_OWNERSHIPS]: SpecialtyOwnershipsRepository,
} = require('../../../src/repositories/GenericRepository');
const JwtService = require('../../../src/services/JwtService');
const UsersTestData = require('../../data/UsersTestData');
const PjsTestData = require('../../data/PjsTestData');
const UsersRepository = require('../../../src/repositories/UsersRepository');

const { APP_NAME } = process.env;

const BASE_API_PATH = `/api/${APP_NAME}`;
const BASE_API_USERS_PATH = `${BASE_API_PATH}/users`;
const BASE_API_PJS_PATH = `${BASE_API_PATH}/pjs`;

const TOKEN_USER_ID = 1;
const PLAYER_TOKEN = `bearer ${JwtService
  .sign({ ...UsersTestData.userVerifiedToken, is_player: true, id: TOKEN_USER_ID })}`;

const MASTER_TOKEN = `bearer ${JwtService
  .sign({ ...UsersTestData.userVerifiedToken, is_master: true, id: TOKEN_USER_ID })}`;

describe('Pjs controller', () => {
  let userId;
  let pjId;
  let specialtyId;

  beforeEach(async () => {
    await DataBaseUtils.cleanDataBase();
    ({ user_id: userId, pj_id: pjId, specialty_id: specialtyId } = await DataBaseUtils.insertInitialTestData());
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
        .send(PjsTestData.createPjBody);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should create a pj', async () => {
      const { status, body: { id: createdPjId } } = await chai.request(server)
        .post(`${BASE_API_USERS_PATH}/${userId}/pjs`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.createPjBody);

      assert.equal(status, 201);
      const foundPj = await PjsRepository.findOne({ id: createdPjId });
      const cleanedPj = DataBaseUtils.cleanRecord(foundPj);

      assert.deepEqual(cleanedPj, PjsTestData.getExpectedCreatedPj(userId));
    });
  });

  describe('Update pj', () => {
    it('Should throw an error if the user does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/123/pjs/123`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.updatePjBody);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should throw an error if the pj does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}/pjs/123`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.updatePjBody);

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
        .send(PjsTestData.updatePjBody);

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
        .send(PjsTestData.updatePjBody);

      assert.equal(status, 400);
      assert.equal(message, JSON.stringify({ ...PjsTestData.pjInvalidState, special_xp_valid: false }));
    });

    it('Should not validate pj state if no stats are provided', async () => {
      const { status } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}/pjs/${pjId}`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.updatePjBodyWithoutStats);

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
        .send(PjsTestData.updatePjBody);

      const cleanedPj = DataBaseUtils.cleanRecord(body);

      assert.deepEqual(cleanedPj, PjsTestData.getExpectedUpdatedPj(userId));
      assert.equal(status, 200);
    });
  });

  describe('Get by user', () => {
    it('Should throw an error if the user does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .get(`${BASE_API_USERS_PATH}/123/pjs`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.createPjBody);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should get a user pjs', async () => {
      const { status, body } = await chai.request(server)
        .get(`${BASE_API_USERS_PATH}/${userId}/pjs`)
        .set('authorization', MASTER_TOKEN);

      const cleanedPjs = DataBaseUtils.cleanRecords(body);
      assert.equal(status, 200);
      assert.deepEqual(cleanedPjs, [{ ...PjsTestData.pj, user_id: userId }]);
    });
  });

  describe('Delete pj', () => {
    it('Should throw an error if the user does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .delete(`${BASE_API_USERS_PATH}/123/pjs/123`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.updatePjBody);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should throw an error if the pj does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .delete(`${BASE_API_USERS_PATH}/${userId}/pjs/123`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.updatePjBody);

      assert.equal(status, 404);
      assert.equal(message, 'Pj with id: 123 not found');
    });

    it('Should throw an error if the pj does not belong to the provided user', async () => {
      const { id: wrongUserId } = await UsersRepository.insertOne(
        { ...UsersTestData.signInInfo, username: 'otherUsername' },
      );

      const { status, body: { error: { message } } } = await chai.request(server)
        .delete(`${BASE_API_USERS_PATH}/${wrongUserId}/pjs/${pjId}`)
        .set('authorization', PLAYER_TOKEN)
        .send(PjsTestData.updatePjBody);

      assert.equal(status, 403);
      assert.equal(message, 'Forbidden');
    });

    it('Should delete a pj', async () => {
      const { status } = await chai.request(server)
        .delete(`${BASE_API_USERS_PATH}/${userId}/pjs/${pjId}`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.updatePjBody);

      const foundPj = await PjsRepository.findOne({ id: pjId });

      assert.equal(status, 204);
      assert(!foundPj);
    });
  });

  describe('Create xp assignations', () => {
    it('Should throw an error if the pj does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .post(`${BASE_API_PJS_PATH}/123/xp-assignations`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.xpAssignationBody);

      assert.equal(status, 404);
      assert.equal(message, 'Pj with id: 123 not found');
    });

    it('Should create an assignation', async () => {
      const { status, body: { id: assignationId } } = await chai.request(server)
        .post(`${BASE_API_PJS_PATH}/${pjId}/xp-assignations`)
        .set('authorization', MASTER_TOKEN)
        .send(PjsTestData.xpAssignationBody);

      const foundAssignation = await XpAssignationsRepository.findOne({ id: assignationId });
      const cleanedAssignation = DataBaseUtils.cleanRecord(foundAssignation);

      assert.equal(status, 201);
      assert.deepEqual(
        cleanedAssignation,
        PjsTestData.getExpectedCreatedAssignation(userId, pjId),
      );
    });
  });

  describe('Get xp assignations', () => {
    beforeEach(async () => {
      await XpAssignationsRepository.insert(PjsTestData.getAssignations(pjId, userId));
    });

    it('Should throw an error if the pj does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .get(`${BASE_API_USERS_PATH}/${userId}/pjs/123/xp-assignations`)
        .set('authorization', PLAYER_TOKEN);

      assert.equal(status, 404);
      assert.equal(message, 'Pj with id: 123 not found');
    });

    it('should work correctly without query parameters', async () => {
      const withQueryParams = false;

      const { status, body } = await chai.request(server)
        .get(`${BASE_API_USERS_PATH}/${userId}/pjs/${pjId}/xp-assignations`)
        .set('authorization', PLAYER_TOKEN);

      const { data: xpAssignations } = body;
      const cleanedXpAssignations = DataBaseUtils.cleanRecords(xpAssignations);
      const cleanedResponse = { ...body, data: cleanedXpAssignations };

      assert.equal(status, 200);
      assert.deepEqual(
        cleanedResponse, PjsTestData.getExpectedAssignationsResponse(pjId, userId, withQueryParams),
      );
    });

    it('should work correctly with query parameters', async () => {
      const withQueryParams = true;

      const { status, body } = await chai.request(server)
        .get(`${BASE_API_USERS_PATH}/${userId}/pjs/${pjId}/xp-assignations`)
        .query(PjsTestData.assignationsQuery)
        .set('authorization', PLAYER_TOKEN);

      const { data: xpAssignations } = body;
      const cleanedXpAssignations = DataBaseUtils.cleanRecords(xpAssignations);
      const cleanedResponse = { ...body, data: cleanedXpAssignations };

      assert.equal(status, 200);
      assert.deepEqual(
        cleanedResponse, PjsTestData.getExpectedAssignationsResponse(pjId, userId, withQueryParams),
      );
    });
  });

  describe('Assigns specialty to pj', () => {
    it('Should throw an error if the pj does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_PJS_PATH}/123/specialties/123`)
        .set('authorization', MASTER_TOKEN);

      assert.equal(status, 404);
      assert.equal(message, 'Pj with id: 123 not found');
    });

    it('Should throw an error if the specialty does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_PJS_PATH}/${pjId}/specialties/123`)
        .set('authorization', MASTER_TOKEN);

      assert.equal(status, 404);
      assert.equal(message, 'Specialty with id: 123 not found');
    });

    it('Should throw an error if the specialty ownership already exists', async () => {
      await SpecialtyOwnershipsRepository.insertOne({ pj_id: pjId, specialty_id: specialtyId });

      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_PJS_PATH}/${pjId}/specialties/${specialtyId}`)
        .set('authorization', MASTER_TOKEN);

      assert.equal(status, 400);
      assert.equal(message, 'Specialty ownership already exists');
    });

    it('Should create a specialty ownership', async () => {
      const { status } = await chai.request(server)
        .put(`${BASE_API_PJS_PATH}/${pjId}/specialties/${specialtyId}`)
        .set('authorization', MASTER_TOKEN);

      const foundSpecialtyOwnership = await SpecialtyOwnershipsRepository
        .findOne({ pj_id: pjId, specialty_id: specialtyId });

      const cleanedFoundSpecialtyOwnership = DataBaseUtils.cleanRecord(foundSpecialtyOwnership);

      assert.equal(status, 201);
      assert.deepEqual(
        cleanedFoundSpecialtyOwnership,
        PjsTestData.getExpectedCreatedSpecialtyOwnership(pjId, specialtyId),
      );
    });
  });
});
