require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../index');

chai.use(chaiHttp);

const DataBaseUtils = require('../../utils/DataBaseTestUtils');
const UsersTestData = require('../../data/UsersTestData');
const JwtService = require('../../../src/services/JwtService');
const EncryptionService = require('../../../src/services/EncryptionService');
const { USERS } = require('../../../src/repositories/TableNames');
const { [USERS]: UsersRepository } = require('../../../src/repositories/GenericRepository');

const { APP_NAME } = process.env;

const BASE_API_PATH = `/api/${APP_NAME}`;
const BASE_API_USERS_PATH = `${BASE_API_PATH}/users`;
const ADMIN_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_admin: true })}`;

describe('Users controller', () => {
  let userId;

  beforeEach(async () => {
    await DataBaseUtils.cleanDataBase();
    ({ user_id: userId } = await DataBaseUtils.insertInitialTestData());
  });

  describe('Sign in', () => {
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

    it('Should sign in', async () => {
      const { status, body: { token } } = await chai.request(server)
        .post(`${BASE_API_PATH}/sign-in`)
        .send(UsersTestData.signInInfo);

      assert.equal(status, 200);
      assert(!!token);
    });
  });

  describe('Create user', () => {
    it('Should throw an error if username already exists', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .post(BASE_API_USERS_PATH)
        .set('authorization', ADMIN_TOKEN)
        .send(UsersTestData.alreadyCreatedUserRequest);

      const { username } = UsersTestData.alreadyCreatedUserRequest;

      assert.equal(status, 400);
      assert.equal(message, `User with username: ${username} already exists`);
    });

    it('Should create an user', async () => {
      const { status, body: { id: createdUserId } } = await chai.request(server)
        .post(BASE_API_USERS_PATH)
        .set('authorization', ADMIN_TOKEN)
        .send(UsersTestData.createUserRequest);

      const { secret: providedSecret } = UsersTestData.createUserRequest;

      const foundUser = await UsersRepository.findOne({ id: createdUserId });
      const cleanedFoundUser = DataBaseUtils.cleanRecord(foundUser);
      const { secret: hashedSecret, ...cleanedFoundUserWithoutSecret } = cleanedFoundUser;

      const isSecretValid = await EncryptionService.compare(providedSecret, hashedSecret);

      assert.equal(status, 201);
      assert.deepEqual(cleanedFoundUserWithoutSecret, UsersTestData.expectedCreatedUser);
      assert(isSecretValid);
    });
  });

  describe('Update user', () => {
    it('Should throw an error if the user does NOT exists', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/123`)
        .set('authorization', ADMIN_TOKEN)
        .send(UsersTestData.updateUserRequest);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should throw an error if the username is already taken', async () => {
      const { username } = await UsersRepository.insertOne(UsersTestData.updateUserRequest);

      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}`)
        .set('authorization', ADMIN_TOKEN)
        .send(UsersTestData.updateUserRequest);

      assert.equal(status, 400);
      assert.equal(message, `Username ${username} already taken`);
    });

    it('Should update an user', async () => {
      const { status } = await chai.request(server)
        .put(`${BASE_API_USERS_PATH}/${userId}`)
        .set('authorization', ADMIN_TOKEN)
        .send(UsersTestData.updateUserRequest);

      const foundUser = await UsersRepository.findOne({ id: userId });
      const cleanedFoundUser = DataBaseUtils.cleanRecord(foundUser);
      const { secret: hashedSecret, ...cleanedFoundUserWithoutSecret } = cleanedFoundUser;
      const { secret: providedSecret } = UsersTestData.updateUserRequest;

      const isSecretValid = await EncryptionService.compare(providedSecret, hashedSecret);

      assert.equal(status, 200);
      assert.deepEqual(cleanedFoundUserWithoutSecret, UsersTestData.expectedUpdatedUser);
      assert(isSecretValid);
    });
  });

  describe('Delete user', () => {
    it('Should throw an error if the user does NOT exists', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .delete(`${BASE_API_USERS_PATH}/123`)
        .set('authorization', ADMIN_TOKEN);

      assert.equal(status, 404);
      assert.equal(message, 'User with id: 123 not found');
    });

    it('Should delete an user', async () => {
      const { status } = await chai.request(server)
        .delete(`${BASE_API_USERS_PATH}/${userId}`)
        .set('authorization', ADMIN_TOKEN);

      const foundUser = await UsersRepository.findOne({ id: userId });

      assert.equal(status, 204);
      assert(!foundUser);
    });
  });
});
