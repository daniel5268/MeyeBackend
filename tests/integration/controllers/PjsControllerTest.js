require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../index');

chai.use(chaiHttp);

const DataBaseUtils = require('../../utils/DataBaseTestUtils');
const { PJS } = require('../../../src/repositories/TableNames');
const { [PJS]: PjsRepository } = require('../../../src/repositories/GenericRepository');
const JwtService = require('../../../src/services/JwtService');
const UsersTestData = require('../../data/UsersTestData');
const PjsTestData = require('../../data/PjsTestData');

const { APP_NAME } = process.env;

const BASE_API_PATH = `/api/${APP_NAME}`;
const BASE_API_USERS_PATH = `${BASE_API_PATH}/users`;
const ADMIN_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_admin: true })}`;

describe('Pjs controller', () => {
  let userId;

  beforeEach(async () => {
    await DataBaseUtils.cleanDataBase();
    ({ user_id: userId } = await DataBaseUtils.insertInitialTestData());
  });

  describe('Create pj', () => {
    it('Should throw an error if the user does NOT exist', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .post(`${BASE_API_USERS_PATH}/123/pjs`)
        .set('authorization', ADMIN_TOKEN)
        .send(PjsTestData.createPjRequest);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should create a pj', async () => {
      const { status, body: { id: pjId } } = await chai.request(server)
        .post(`${BASE_API_USERS_PATH}/${userId}/pjs`)
        .set('authorization', ADMIN_TOKEN)
        .send(PjsTestData.createPjRequest);

      assert.equal(status, 201);
      const foundPj = await PjsRepository.findOne({ id: pjId });
      const cleanedPj = DataBaseUtils.cleanRecord(foundPj);

      assert.deepEqual(cleanedPj, { ...PjsTestData.expectedCreatedPJ, user_id: userId });
    });
  });
});
