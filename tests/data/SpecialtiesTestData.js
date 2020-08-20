const SpecialtiesTestData = module.exports;

SpecialtiesTestData.specialty = {
  name: 'attack_run',
  associated_stat: 'speed',
  description: 'Includes those attacks where its necessary to run and attack in the same action',
};

SpecialtiesTestData.createSpecialtyBody = { ...SpecialtiesTestData.specialty };

SpecialtiesTestData.expectedCreatedSpecialty = { ...SpecialtiesTestData.specialty };

SpecialtiesTestData.specialties = [
  SpecialtiesTestData.specialty,
  {
    name: 'impact',
    associated_stat: 'strength',
    description: 'Increases the impact damage',
  },
  {
    name: 'climb',
    associated_stat: 'strength',
    description: 'Ability to climb',
  },
  {
    name: 'jump',
    associated_stat: 'strength',
    description: 'Ability to jump',
  },
  {
    name: 'displacement',
    associated_stat: 'speed',
    description: 'Extra displacement',
  },
];

SpecialtiesTestData.expectedSpecialtiesWithoutQueryParams = [...SpecialtiesTestData.specialties];

SpecialtiesTestData.expectedSpecialtiesResponseWithoutQueryParams = {
  data: [...SpecialtiesTestData.specialties],
  page: 1,
  size: 20,
  last_page: 1,
  total: 5,
};

SpecialtiesTestData.getSpecialtiesQuery = {
  associated_stat: 'strength',
  page: 2,
  size: 2,
};

SpecialtiesTestData.expectedSpecialtiesWithQueryParams = [
  {
    name: 'jump',
    associated_stat: 'strength',
    description: 'Ability to jump',
  },
];

SpecialtiesTestData.expectedSpecialtiesResponseWithQueryParams = {
  data: [...SpecialtiesTestData.expectedSpecialtiesWithQueryParams],
  page: 2,
  size: 2,
  last_page: 2,
  total: 3,
};

SpecialtiesTestData.updateSpecialtyBody = {
  ...SpecialtiesTestData.specialty,
  name: 'updated name',
};

SpecialtiesTestData.expectedUpdatedSpecialty = {
  ...SpecialtiesTestData.specialty,
  ...SpecialtiesTestData.updateSpecialtyBody,
};
