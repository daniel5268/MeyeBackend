require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const JwtService = require('../../../src/services/JwtService');
const { SPECIALTIES } = require('../../../src/repositories/TableNames');
const { [SPECIALTIES]: SpecialtiesRepository } = require('../../../src/repositories/GenericRepository');
const DataBaseUtils = require('../../utils/DataBaseTestUtils');
const UsersTestData = require('../../data/UsersTestData');
const SpecialtiesTestData = require('../../data/SpecialtiesTestData');
const server = require('../../../index');

chai.use(chaiHttp);

const { APP_NAME } = process.env;

const BASE_API_PATH = `/api/${APP_NAME}`;

const BASE_API_SPECIALTIES_PATH = `${BASE_API_PATH}/specialties`;
const MASTER_TOKEN = `bearer ${JwtService.sign({ ...UsersTestData.userVerifiedToken, is_master: true })}`;

describe('Specialties controller', () => {
  beforeEach(async () => {
    await DataBaseUtils.cleanDataBase();
  });

  describe('Create specialty', () => {
    it('Should throw an error if a specialty with the provided name already exists', async () => {
      await SpecialtiesRepository.insertOne(SpecialtiesTestData.specialty);

      const { status, body: { error: { message } } } = await chai.request(server)
        .post(BASE_API_SPECIALTIES_PATH)
        .set('authorization', MASTER_TOKEN)
        .send(SpecialtiesTestData.createSpecialtyBody);

      const { name } = SpecialtiesTestData.createSpecialtyBody;

      assert.equal(status, 400);
      assert.equal(message, `Specialty with name: ${name} already exists`);
    });

    it('Should create a specialty', async () => {
      const { status, body: { id: createdSpecialtyId } } = await chai.request(server)
        .post(BASE_API_SPECIALTIES_PATH)
        .set('authorization', MASTER_TOKEN)
        .send(SpecialtiesTestData.createSpecialtyBody);

      const foundSpecialty = await SpecialtiesRepository.findOne({ id: createdSpecialtyId });
      const cleanedFoundSpecialty = DataBaseUtils.cleanRecord(foundSpecialty);

      assert.equal(status, 201);
      assert.deepEqual(cleanedFoundSpecialty, SpecialtiesTestData.expectedCreatedSpecialty);
    });
  });

  describe('Get specialties', () => {
    beforeEach(async () => {
      await SpecialtiesRepository.insert(SpecialtiesTestData.specialties);
    });

    it('should work correctly without query parameters', async () => {
      const { status, body } = await chai.request(server)
        .get(BASE_API_SPECIALTIES_PATH)
        .set('authorization', MASTER_TOKEN);

      const { data: specialties } = body;
      const cleanedSpecialties = DataBaseUtils.cleanRecords(specialties);
      const cleanedResponse = { ...body, data: cleanedSpecialties };

      assert.equal(status, 200);
      assert.deepEqual(
        cleanedResponse, SpecialtiesTestData.expectedSpecialtiesResponseWithoutQueryParams,
      );
    });

    it('should work correctly with query parameters', async () => {
      const { status, body } = await chai.request(server)
        .get(BASE_API_SPECIALTIES_PATH)
        .query(SpecialtiesTestData.getSpecialtiesQuery)
        .set('authorization', MASTER_TOKEN);

      const { data: specialties } = body;
      const cleanedSpecialties = DataBaseUtils.cleanRecords(specialties);
      const cleanedResponse = { ...body, data: cleanedSpecialties };

      assert.equal(status, 200);
      assert.deepEqual(
        cleanedResponse, SpecialtiesTestData.expectedSpecialtiesResponseWithQueryParams,
      );
    });
  });

  describe('Update specialty', () => {
    let specialtyId;

    beforeEach(async () => {
      ({ id: specialtyId } = await SpecialtiesRepository.insertOne(SpecialtiesTestData.specialty));
    });

    it('Should throw an error if the specialty does NOT exists', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_SPECIALTIES_PATH}/123`)
        .set('authorization', MASTER_TOKEN)
        .send(SpecialtiesTestData.updateSpecialtyBody);

      assert.equal(status, 404);
      assert.equal(message, 'Specialty with id: 123 not found');
    });

    it('Should throw an error if the name is already taken', async () => {
      const { name } = await SpecialtiesRepository.insertOne(SpecialtiesTestData.updateSpecialtyBody);

      const { status, body: { error: { message } } } = await chai.request(server)
        .put(`${BASE_API_SPECIALTIES_PATH}/${specialtyId}`)
        .set('authorization', MASTER_TOKEN)
        .send(SpecialtiesTestData.updateSpecialtyBody);

      assert.equal(status, 400);
      assert.equal(message, `Name ${name} already taken`);
    });

    it('Should update an specialty', async () => {
      const { status } = await chai.request(server)
        .put(`${BASE_API_SPECIALTIES_PATH}/${specialtyId}`)
        .set('authorization', MASTER_TOKEN)
        .send(SpecialtiesTestData.updateSpecialtyBody);

      const foundSpecialty = await SpecialtiesRepository.findOne({ id: specialtyId });
      const cleanedFoundSpecialty = DataBaseUtils.cleanRecord(foundSpecialty);

      assert.equal(status, 200);
      assert.deepEqual(cleanedFoundSpecialty, SpecialtiesTestData.expectedUpdatedSpecialty);
    });
  });

  describe('Delete specialty', () => {
    let specialtyId;
    beforeEach(async () => {
      ({ id: specialtyId } = await SpecialtiesRepository.insertOne(SpecialtiesTestData.specialty));
    });

    it('Should throw an error if the specialty does NOT exists', async () => {
      const { status, body: { error: { message } } } = await chai.request(server)
        .delete(`${BASE_API_SPECIALTIES_PATH}/123`)
        .set('authorization', MASTER_TOKEN);

      assert.equal(status, 404);
      assert.equal(message, 'Specialty with id: 123 not found');
    });

    it('Should delete a specialty', async () => {
      const { status } = await chai.request(server)
        .delete(`${BASE_API_SPECIALTIES_PATH}/${specialtyId}`)
        .set('authorization', MASTER_TOKEN);

      const foundSpecialty = await SpecialtiesRepository.findOne({ id: specialtyId });

      assert.equal(status, 204);
      assert(!foundSpecialty);
    });
  });
});
