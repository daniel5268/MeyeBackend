const PjsTestData = module.exports;

PjsTestData.createPjRequest = {
  name: 'testName',
};

PjsTestData.expectedCreatedPJ = {
  ...PjsTestData.createPjRequest,
  age: 0,
  appearance: 0,
  charisma: 0,
  heroism: 0,
  villainy: 0,
  exp: { type_1: 0, type_2: 0, type_3: 0 },
  containers: { life: 0, energy: 0, special_energy: 0 },
  type_1: {},
  type_2: {},
  type_3: {},
};
