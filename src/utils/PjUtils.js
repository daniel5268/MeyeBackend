const PjUtils = module.exports;

const BASIC_HANDICAP = 2;
const BASIC_FIRST_LEVEL_STAT_COST = 1;
const BASIC_LEVEL_RANGE = 10;

const ABILITIES_HANDICAP = 1;
const ABILITIES_FIRST_LEVEL_STAT_COST = 1;
const ABILITIES_LEVEL_RANGE = 100;

const ENERGY_COST = 10;

const LIFE_COST = 5;

function getCompletedLevelsSpentXp(params) {
  const {
    handicap = 0,
    first_level_stat_cost: firstLevelStatCost = 1, completed_levels: completedLevels, level_range: levelRange,
  } = params;

  const realFirstLevelStatCost = firstLevelStatCost + handicap;
  const resultParam = realFirstLevelStatCost + completedLevels - 1;
  const diffSummationParam = realFirstLevelStatCost - 1;

  const resultSummation = (resultParam * (resultParam + 1)) / 2;
  const diffSummation = (diffSummationParam * (diffSummationParam + 1)) / 2;

  return (resultSummation - diffSummation) * levelRange;
}

function getDivineSpentXp() {
  return 0;
}

PjUtils.getStatSpentXp = (params) => {
  const {
    stat_value: statValue, level_range: levelRange, first_level_stat_cost: firstLevelStatCost = 1, handicap = 0,
  } = params;

  const completedLevels = parseInt(statValue / levelRange, 10);
  const leftPoints = statValue % levelRange;

  const completedLevelsSpentXp = getCompletedLevelsSpentXp({ ...params, completed_levels: completedLevels });
  const leftPointsSpentXp = (completedLevels + firstLevelStatCost + handicap) * leftPoints;

  return completedLevelsSpentXp + leftPointsSpentXp;
};

PjUtils.getSectionSpentXp = (params) => {
  const { stat_group_section: statGroupSection, join_section: joinSection = false } = params;

  const statGroupSectionKeys = Object.keys(statGroupSection);

  if (joinSection) {
    const statValue = statGroupSectionKeys.reduce((accumulatedStatValues, statName) => accumulatedStatValues
      + statGroupSection[statName], 0);

    return PjUtils.getStatSpentXp({ ...params, stat_value: statValue });
  }

  return statGroupSectionKeys.reduce((accumulatedXp, statName) => accumulatedXp
    + PjUtils.getStatSpentXp({ ...params, stat_value: statGroupSection[statName] }), 0);
};

PjUtils.getStatGroupSpentXp = (params) => {
  const {
    stat_group: statGroup, talent, stat_group_handicap: statGroupHandicap,
  } = params;

  const statGroupKeys = Object.keys(statGroup);

  const spentXp = statGroupKeys.reduce((accumulatedXp, statGroupKey) => {
    const handicap = statGroupKey === talent ? 0 : statGroupHandicap;

    return accumulatedXp
      + PjUtils.getSectionSpentXp({ ...params, stat_group_section: statGroup[statGroupKey], handicap });
  }, 0);

  return spentXp;
};

PjUtils.getPjSpentXp = (pj, options = {}) => {
  const section = 'PjUtils.getPjSpentXp';
  const { logger = console } = options;
  logger.info(section, `starts for ${JSON.stringify(pj)}`);

  const {
    stats: {
      basic, abilities, energy, life,
    },
    basic_talent: basicTalent,
    special_talent: specialTalent,
  } = pj;

  const basicSpentXp = PjUtils.getStatGroupSpentXp(
    {
      level_range: BASIC_LEVEL_RANGE,
      first_level_stat_cost: BASIC_FIRST_LEVEL_STAT_COST,
      stat_group: basic,
      stat_group_handicap: BASIC_HANDICAP,
      talent: basicTalent,

    },
  );
  const abilitiesSpentXp = PjUtils.getStatGroupSpentXp(
    {
      level_range: ABILITIES_LEVEL_RANGE,
      first_level_stat_cost: ABILITIES_FIRST_LEVEL_STAT_COST,
      stat_group: abilities,
      stat_group_handicap: ABILITIES_HANDICAP,
      talent: specialTalent,
      join_section: true,
    },
  );
  const energySpentXp = basicTalent === 'energy'
    ? (energy.basic + energy.special) * (ENERGY_COST / 2)
    : energy.basic * ENERGY_COST;
  const lifeSpentXp = life * LIFE_COST;
  const divineSpentXp = getDivineSpentXp();

  return {
    basic: basicSpentXp + lifeSpentXp,
    special: abilitiesSpentXp + energySpentXp,
    divine: divineSpentXp,
  };
};

PjUtils.getPjValidStates = (pj, earnedXp, options = {}) => {
  const section = 'PjUtils.validatePjState';
  const { logger = console } = options;
  logger.info(section, `starts for ${JSON.stringify(pj)}`);

  const {
    basic: spentBasicXp,
    special: spentSpecialXp,
    divine: spentDivineXp,
  } = PjUtils.getPjSpentXp(pj, options);

  const { basic: earnedBasicXp, special: earnedSpecialXp, divine: earnedDivineXp } = earnedXp;

  const basicXpValid = (spentBasicXp <= earnedBasicXp);
  const specialXpValid = (spentSpecialXp <= earnedSpecialXp);
  const divineXpValid = (spentDivineXp <= earnedDivineXp);
  const xpValid = basicXpValid && specialXpValid && divineXpValid;

  return {
    xp_valid: xpValid, basic_xp_valid: basicXpValid, special_xp_valid: specialXpValid, divine_xp_valid: divineXpValid,
  };
};
