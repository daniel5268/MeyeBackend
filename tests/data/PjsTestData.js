const PjsTestData = module.exports;

PjsTestData.createPjBody = {
  name: 'testName',
  type: 'human',
};

PjsTestData.expectedCreatedPJ = {
  ...PjsTestData.createPjBody,
  race: null,
  description: null,
  sanity: 0,
  charisma: 0,
  heroism: 0,
  villainy: 0,
  appearance: 0,
  age: 0,
  height: 0,
  weight: 0,
  basic_talent: null,
  special_talent: null,
  stats: {
    basic: {
      physical: {
        strength: 0, agility: 0, speed: 0, resistance: 0,
      },
      mental: {
        intelligence: 0, wisdom: 0, concentration: 0, will: 0,
      },
      coordination: {
        precision: 0, calculation: 0, range: 0, reflexes: 0,
      },
    },

    abilities: {
      bodily: { empowerment: 0, vital_control: 0 },
      energy: { pure_energy: 0, objects_control: 0 },
      mental: { delusion: 0, mental_control: 0 },
    },

    energy: { basic: 0, special: 0 },
    life: 0,

    divine: { },
  },
  renels: 0,
  bag_size: 0,
  commerce: false,
  storage: false,
};

PjsTestData.getExpectedCreatedPj = (userId) => ({
  ...PjsTestData.expectedCreatedPJ, user_id: userId,
});

PjsTestData.pj = {
  name: 'testName',
  type: 'soko',
  race: 'haiken',
  description: 'some description',
  sanity: 20,
  charisma: 10,
  heroism: 5,
  villainy: 4,
  appearance: 12,
  age: 25,
  height: 160,
  weight: 15,
  basic_talent: 'physical',
  special_talent: 'bodily',
  stats: {
    basic: {
      physical: {
        strength: 12, agility: 12, speed: 13, resistance: 14,
      },
      mental: {
        intelligence: 21, wisdom: 22, concentration: 23, will: 24,
      },
      coordination: {
        precision: 31, calculation: 33, range: 33, reflexes: 34,
      },
    },
    abilities: {
      bodily: { empowerment: 122, vital_control: 100 },
      energy: { pure_energy: 200, objects_control: 200 },
      mental: { delusion: 303, mental_control: 300 },
    },
    energy: { basic: 200, special: 0 },
    life: 50,
    divine: { },
  },
  renels: 200,
  bag_size: 10,
  commerce: false,
  storage: false,
};

PjsTestData.pjSpentXp = {
  basic: 1188,
  special: 6490,
  divine: 0,
};

PjsTestData.updatePjBodyWithoutStats = {
  sanity: 15,
  name: 'testNameUpdated',
};

PjsTestData.updatePjBody = {
  ...PjsTestData.updatePjBodyWithoutStats,
  stats: {
    basic: {
      physical: {
        strength: 10, agility: 10, speed: 10, resistance: 10,
      },
      mental: {
        intelligence: 10, wisdom: 10, concentration: 10, will: 10,
      },
      coordination: {
        precision: 10, calculation: 10, range: 10, reflexes: 10,
      },
    },
    abilities: {
      bodily: { empowerment: 100, vital_control: 100 },
      energy: { pure_energy: 100, objects_control: 100 },
      mental: { delusion: 100, mental_control: 100 },
    },
    energy: { basic: 10, special: 10 },
    life: 10,
    divine: { },
  },
};

PjsTestData.expectedUpdatedPj = {
  ...PjsTestData.pj,
  ...PjsTestData.updatePjBody,
};

PjsTestData.getExpectedUpdatedPj = (userId) => ({
  ...PjsTestData.expectedUpdatedPj,
  user_id: userId,
});

PjsTestData.enoughBasicXpAssignations = [
  { type: 'basic', amount: 100 },
  { type: 'basic', amount: 110 },
  { type: 'basic', amount: 120 },
];

PjsTestData.insufficientBasicXpAssignations = [
  { type: 'basic', amount: 99 },
  { type: 'basic', amount: 110 },
  { type: 'basic', amount: 120 },
];

PjsTestData.enoughSpecialXpAssignations = [
  { type: 'special', amount: 500 },
  { type: 'special', amount: 600 },
  { type: 'special', amount: 300 },
];

PjsTestData.insufficientSpecialXpAssignations = [
  { type: 'special', amount: 499 },
  { type: 'special', amount: 600 },
  { type: 'special', amount: 300 },
];

PjsTestData.pjInvalidState = {
  xp_valid: false, basic_xp_valid: true, special_xp_valid: true, divine_xp_valid: true,
};

PjsTestData.xpAssignationBody = {
  type: 'basic',
  amount: 100,
};

PjsTestData.expectedCreatedAssignation = {
  ...PjsTestData.xpAssignationBody,
};

PjsTestData.getExpectedCreatedAssignation = (userId, pjId) => ({
  ...PjsTestData.expectedCreatedAssignation,
  user_id: userId,
  pj_id: pjId,
});

PjsTestData.assignations = [
  { type: 'divine', amount: 1 },
  { type: 'divine', amount: 2 },
  { type: 'divine', amount: 3 },
  { type: 'divine', amount: 4 },
  { type: 'divine', amount: 5 },
  { type: 'basic', amount: 10 },
  { type: 'basic', amount: 20 },
  { type: 'basic', amount: 30 },
  { type: 'basic', amount: 40 },
  { type: 'basic', amount: 50 },
  { type: 'special', amount: 100 },
  { type: 'special', amount: 200 },
  { type: 'special', amount: 300 },
  { type: 'special', amount: 400 },
  { type: 'special', amount: 500 },
];

PjsTestData.getAssignations = (pjId, userId) => PjsTestData.assignations
  .map((assignation) => ({ ...assignation, user_id: userId, pj_id: pjId }));

PjsTestData.assignationsQuery = {
  type: 'basic',
  page: 2,
  size: 3,
};

PjsTestData.queryAssignations = [
  { type: 'basic', amount: 40 },
  { type: 'basic', amount: 50 },
];

PjsTestData.getQueryAssignations = (pjId, userId) => PjsTestData.queryAssignations
  .map((assignation) => ({ ...assignation, user_id: userId, pj_id: pjId }));

PjsTestData.expectedAssignationsResponseWithQueryParams = {
  page: 2,
  size: 3,
  last_page: 2,
  total: 5,
};

PjsTestData.expectedAssignationsResponseWithoutQueryParams = {
  page: 1,
  size: 20,
  last_page: 1,
  total: 15,
};

PjsTestData.getExpectedAssignationsResponse = (pjId, userId, withQueryParams) => {
  const data = withQueryParams ? PjsTestData.getQueryAssignations(pjId, userId)
    : PjsTestData.getAssignations(pjId, userId);

  const basicResponse = withQueryParams ? PjsTestData.expectedAssignationsResponseWithQueryParams
    : PjsTestData.expectedAssignationsResponseWithoutQueryParams;

  return { ...basicResponse, data };
};

PjsTestData.expectedCreatedSpecialtyOwnership = {
  value: 0,
};

PjsTestData.getExpectedCreatedSpecialtyOwnership = (pjId, specialtyId) => ({
  ...PjsTestData.expectedCreatedSpecialtyOwnership,
  pj_id: pjId,
  specialty_id: specialtyId,
});
