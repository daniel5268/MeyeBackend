const PjsTestData = module.exports;

PjsTestData.createPjRequest = {
  name: 'testName',
  type: 'human',
};

PjsTestData.expectedCreatedPJ = {
  ...PjsTestData.createPjRequest,
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

PjsTestData.updatePjRequestWithoutStats = {
  sanity: 15,
  name: 'testNameUpdated',
};

PjsTestData.updatePjRequest = {
  ...PjsTestData.updatePjRequestWithoutStats,
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
  ...PjsTestData.updatePjRequest,
};

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
