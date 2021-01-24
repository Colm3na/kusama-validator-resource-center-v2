// @ts-check
const { BigNumber } = require('bignumber.js');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const pino = require('pino');
const axios = require('axios').default;
const { wait } = require('../utils.js');

const logger = pino();
const loggerOptions = {
  crawler: 'ranking',
};

async function getThousandValidators() {
  try {
    const response = await axios.get('https://kusama.w3f.community/candidates');
    return response.data;
  } catch (error) {
    logger.error(loggerOptions, `Error fetching Thousand Validator Program stats: ${JSON.stringify(error)}`);
    return false;
  }
}

function isVerifiedIdentity(identity) {
  if (identity.judgements.length === 0) {
    return false;
  }
  return identity.judgements
    .filter(([, judgement]) => !judgement.isFeePaid)
    .some(([, judgement]) => judgement.isKnownGood || judgement.isReasonable);
}

function getName(identity) {
  if (
    identity.displayParent
    && identity.displayParent !== ''
    && identity.display
    && identity.display !== ''
  ) {
    return `${identity.displayParent}/${identity.display}`;
  }
  return identity.display || '';
}

function getClusterName(identity) {
  return identity.displayParent || '';
}

function subIdentity(identity) {
  if (
    identity.displayParent
    && identity.displayParent !== ''
    && identity.display
    && identity.display !== ''
  ) {
    return true;
  }
  return false;
}

function getIdentityRating(name, verifiedIdentity, hasAllFields) {
  if (verifiedIdentity && hasAllFields) {
    return 3;
  } if (verifiedIdentity && !hasAllFields) {
    return 2;
  } if (name !== '') {
    return 1;
  }
  return 0;
}

function parseIdentity(identity) {
  const verifiedIdentity = isVerifiedIdentity(identity);
  const hasSubIdentity = subIdentity(identity);
  const name = getName(identity);
  const hasAllFields = identity.display
    && identity.legal
    && identity.web
    && identity.email
    && identity.twitter
    && identity.riot;
  const identityRating = getIdentityRating(name, verifiedIdentity, hasAllFields);
  return {
    verifiedIdentity,
    hasSubIdentity,
    name,
    identityRating,
  };
}

function getCommissionHistory(accountId, erasPreferences) {
  const commissionHistory = [];
  erasPreferences.forEach(({ validators }) => {
    if (validators[accountId]) {
      commissionHistory.push(
        (validators[accountId].commission / 10000000).toFixed(2),
      );
    } else {
      commissionHistory.push(null);
    }
  });
  return commissionHistory;
}

function getCommissionRating(commission, commissionHistory) {
  if (commission !== 100 && commission !== 0) {
    if (commission > 10) {
      return 1;
    }
    if (commission >= 5) {
      if (
        commissionHistory.length > 1
        && commissionHistory[0] > commissionHistory[commissionHistory.length - 1]
      ) {
        return 3;
      }
      return 2;
    }
    if (commission < 5) {
      return 3;
    }
  }
  return 0;
}

function getPayoutRating(payoutHistory, config) {
  const pendingEras = payoutHistory.filter((era) => era === 'pending').length;
  if (pendingEras <= config.erasPerDay) {
    return 3;
  } if (pendingEras <= 3 * config.erasPerDay) {
    return 2;
  } if (pendingEras < 7 * config.erasPerDay) {
    return 1;
  }
  return 0;
}

function getClusterMembers(hasSubIdentity, validators, validatorIdentity) {
  if (!hasSubIdentity) {
    return 0;
  }
  return validators.filter(
    ({ identity }) => identity.displayParent === validatorIdentity.displayParent,
  ).length;
}

module.exports = {
  start: async (wsProviderUrl, pool, config) => {
    await wait(config.startDelay);
    logger.info(loggerOptions, 'Starting ranking crawler...');
    const startTime = new Date().getTime();

    //
    // data collection
    //
    const thousandValidators = await getThousandValidators();
    const wsProvider = new WsProvider(wsProviderUrl);
    const api = await ApiPromise.create({ provider: wsProvider });
    const withActive = false;
    const erasHistoric = await api.derive.staking.erasHistoric(withActive);
    const eraIndexes = erasHistoric.slice(
      Math.max(erasHistoric.length - config.historySize, 0),
    );
    const { maxNominatorRewardedPerValidator } = api.consts.staking;

    let validators = [];
    let intentions = [];

    const [
      { block },
      validatorAddresses,
      waitingInfo,
      nominators,
      councilVotes,
      erasPoints,
      erasPreferences,
      erasSlashes,
      proposals,
      referendums,
    ] = await Promise.all([
      api.rpc.chain.getBlock(),
      api.query.session.validators(),
      api.derive.staking.waitingInfo(),
      api.query.staking.nominators.entries(),
      api.derive.council.votes(),
      // eslint-disable-next-line no-underscore-dangle
      api.derive.staking._erasPoints(eraIndexes, withActive),
      // eslint-disable-next-line no-underscore-dangle
      api.derive.staking._erasPrefs(eraIndexes, withActive),
      // eslint-disable-next-line no-underscore-dangle
      api.derive.staking._erasSlashes(eraIndexes, withActive),
      api.derive.democracy.proposals(),
      api.derive.democracy.referendums(),
    ]);
    validators = await Promise.all(
      validatorAddresses.map(
        (authorityId) => api.derive.staking.query(authorityId, {
          withDestination: false,
          withExposure: true,
          withLedger: true,
          withNominations: false,
          withPrefs: true,
        }),
      ),
    );
    validators = await Promise.all(
      validators.map(
        (validator) => api.derive.accounts.info(validator.accountId).then(({ identity }) => ({
          ...validator,
          identity,
          active: true,
        })),
      ),
    );
    intentions = await Promise.all(
      JSON.parse(
        JSON.stringify(waitingInfo.info),
      ).map((intention) => api.derive.accounts.info(intention.accountId).then(({ identity }) => ({
        ...intention,
        identity,
        active: false,
      }))),
    );
    // api.disconnect()
    const dataCollectionEndTime = new Date().getTime();
    const dataCollectionTime = dataCollectionEndTime - startTime;

    //
    // data processing
    //
    const blockHeight = parseInt(block.header.number.toString(), 10);
    const numActiveValidators = validatorAddresses.length;
    const eraPointsHistoryTotals = [];
    erasPoints.forEach(({ eraPoints }) => {
      eraPointsHistoryTotals.push(parseInt(eraPoints.toString(), 10));
    });
    const eraPointsHistoryTotalsSum = eraPointsHistoryTotals.reduce(
      (total, num) => total + num,
      0,
    );
    const eraPointsAverage = eraPointsHistoryTotalsSum / numActiveValidators;
    // eslint-disable-next-line
    const nominations = nominators.map(([key, nominations]) => {
      const nominator = key.toHuman()[0];
      // eslint-disable-next-line
      const targets = nominations.toJSON()['targets'];
      return {
        nominator,
        targets,
      };
    });
    const participateInGovernance = [];
    proposals.forEach(({ seconds, proposer }) => {
      participateInGovernance.push(proposer.toString());
      seconds.forEach((accountId) => participateInGovernance.push(accountId.toString()));
    });
    referendums.forEach(({ votes }) => {
      votes.forEach(({ accountId }) => participateInGovernance.push(accountId.toString()));
    });
    validators = validators.concat(intentions);
    const ranking = validators
      .map((validator) => {
        // active
        const { active } = validator;
        const activeRating = active ? 2 : 0;

        // stash
        const stashAddress = validator.stashId.toString();

        // thousand validators program
        const includedThousandValidator = thousandValidators.some(
          ({ stash }) => stash === stashAddress,
        );
        const thousandValidator = includedThousandValidator ? thousandValidators.find(
          ({ stash }) => stash === stashAddress,
        ) : '';

        // controller
        const controllerAddress = validator.controllerId.toString();

        // identity
        const {
          verifiedIdentity,
          hasSubIdentity,
          name,
          identityRating,
        } = parseIdentity(validator.identity);
        const identity = JSON.parse(JSON.stringify(validator.identity));

        // sub-accounts
        const clusterMembers = getClusterMembers(
          hasSubIdentity,
          validators,
          validator.identity,
        );
        const partOfCluster = clusterMembers > 1;
        const clusterName = getClusterName(validator.identity);
        const subAccountsRating = hasSubIdentity ? 2 : 0;

        // nominators
        // eslint-disable-next-line
        const nominators = active
          ? validator.exposure.others.length
          : nominations.filter((nomination) => nomination.targets.some(
            (target) => target === validator.accountId.toString(),
          )).length;
        const nominatorsRating = nominators > 0
            && nominators <= maxNominatorRewardedPerValidator.toNumber()
          ? 2
          : 0;

        // slashes
        const slashes = erasSlashes.filter(
          // eslint-disable-next-line
          ({ validators }) => validators[validator.accountId.toString()],
        ) || [];
        const slashed = slashes.length > 0;
        const slashRating = slashed ? 0 : 2;

        // commission
        const commission = parseInt(validator.validatorPrefs.commission.toString(), 10) / 10000000;
        const commissionHistory = getCommissionHistory(
          validator.accountId,
          erasPreferences,
        );
        const commissionRating = getCommissionRating(
          commission,
          commissionHistory,
        );

        // governance
        const councilBacking = validator.identity?.parent
          ? councilVotes.some(
            (vote) => vote[0].toString() === validator.accountId.toString(),
          )
            || councilVotes.some(
              (vote) => vote[0].toString() === validator.identity.parent.toString(),
            )
          : councilVotes.some(
            (vote) => vote[0].toString() === validator.accountId.toString(),
          );
        const activeInGovernance = validator.identity?.parent
          ? participateInGovernance.includes(validator.accountId.toString())
            || participateInGovernance.includes(
              validator.identity.parent.toString(),
            )
          : participateInGovernance.includes(validator.accountId.toString());
        // eslint-disable-next-line no-nested-ternary
        const governanceRating = councilBacking && activeInGovernance
          ? 3
          : councilBacking || activeInGovernance
            ? 2
            : 0;

        // era points and frecuency of payouts
        const eraPointsHistory = [];
        const payoutHistory = [];
        // eslint-disable-next-line
        erasPoints.forEach((eraPoints) => {
          const { era } = eraPoints;
          let eraPayoutState = 'inactive';
          if (eraPoints.validators[validator.accountId]) {
            eraPointsHistory.push(parseInt(eraPoints.validators[validator.accountId], 10));
            if (validator.stakingLedger.claimedRewards.includes(era)) {
              eraPayoutState = 'paid';
            } else {
              eraPayoutState = 'pending';
            }
          } else {
            eraPointsHistory.push(0);
          }
          payoutHistory.push(eraPayoutState);
        });
        const eraPointsHistoryValidator = eraPointsHistory.reduce(
          (total, num) => total + num,
          0,
        );
        const eraPointsPercent = (eraPointsHistoryValidator * 100) / eraPointsHistoryTotalsSum;
        const eraPointsRating = eraPointsHistoryValidator > eraPointsAverage ? 2 : 0;
        const payoutRating = getPayoutRating(payoutHistory, config);

        // stake
        const selfStake = active
          ? new BigNumber(validator.exposure.own.toString())
          : new BigNumber(validator.stakingLedger.total.toString());
        const totalStake = active
          ? new BigNumber(validator.exposure.total.toString())
          : selfStake;
        const otherStake = active
          ? totalStake.minus(selfStake)
          : new BigNumber(0);

        // total rating
        const totalRating = activeRating
          + identityRating
          + subAccountsRating
          + nominatorsRating
          + commissionRating
          + eraPointsRating
          + slashRating
          + governanceRating
          + payoutRating;

        return {
          active,
          activeRating,
          name,
          identity,
          hasSubIdentity,
          subAccountsRating,
          verifiedIdentity,
          identityRating,
          stashAddress,
          controllerAddress,
          thousandValidator,
          partOfCluster,
          clusterName,
          clusterMembers,
          nominators,
          nominatorsRating,
          commission,
          commissionHistory,
          commissionRating,
          eraPointsHistory,
          eraPointsPercent,
          eraPointsRating,
          slashed,
          slashRating,
          slashes,
          councilBacking,
          activeInGovernance,
          governanceRating,
          payoutHistory,
          payoutRating,
          selfStake,
          otherStake,
          totalStake,
          totalRating,
        };
      })
      .sort((a, b) => (a.totalRating < b.totalRating ? 1 : -1))
      .map((validator, rank) => ({
        rank: rank + 1,
        ...validator,
      }));
    // console.log(JSON.parse(JSON.stringify(ranking)))

    // store in db
    logger.info(loggerOptions, `Storing ${ranking.length} validators in db...`);
    // eslint-disable-next-line no-restricted-syntax
    for (const validator of ranking) {
      const sql = `
        INSERT INTO ranking (
          block_height,
          rank,
          active,
          active_rating,
          name,
          identity,
          has_sub_identity,
          sub_accounts_rating,
          verified_identity,
          identity_rating,
          stash_address,
          controller_address,
          included_thousand_validator,
          thousand_validator,
          part_cf_cluster,
          cluster_name,
          cluster_members,
          nominators,
          nominators_rating,
          commission,
          commission_history,
          commission_rating,
          era_points_history,
          era_points_percent,
          era_points_rating,
          slashed,
          slash_rating,
          slashes,
          council_backing,
          active_in_governance,
          governance_rating,
          payout_history,
          payout_rating,
          self_stake,
          other_stake,
          total_stake,
          total_rating,
          timestamp
        ) VALUES (
          '${blockHeight}',
          '${validator.rank}',
          '${validator.active}',
          '${validator.activeRating}',
          '${validator.name}',
          '${JSON.stringify(validator.identity)}',
          '${validator.hasSubIdentity}',
          '${validator.subAccountsRating}',
          '${validator.verifiedIdentity}',
          '${validator.identityRating}',
          '${validator.stashAddress}',
          '${validator.controllerAddress}',
          '${validator.includedThousandValidator}',
          '${JSON.stringify(validator.thousandValidator)}',
          '${validator.partOfCluster}',
          '${validator.clusterName}',
          '${validator.clusterMembers}',
          '${validator.nominators}',
          '${validator.nominatorsRating}',
          '${validator.commission}',
          '${validator.commissionHistory}',
          '${validator.commissionRating}',
          '${validator.eraPointsHistory}',
          '${validator.eraPointsPercent}',
          '${validator.eraPointsRating}',
          '${validator.slashed}',
          '${validator.slashRating}',
          '${JSON.stringify(validator.slashes)}',
          '${validator.councilBacking}',
          '${validator.activeInGovernance}',
          '${validator.governanceRating}',
          '${validator.payoutHistory}',
          '${validator.payoutRating}',
          '${validator.selfStake}',
          '${validator.otherStake}',
          '${validator.totalStake}',
          '${validator.totalRating}',
          '${startTime}'
        )`;
      try {
        // eslint-disable-next-line no-await-in-loop
        await pool.query(sql);
      } catch (error) {
        logger.error(loggerOptions, `Error inserting data in ranking table: ${JSON.stringify(error)}`);
      }
    }
    const endTime = new Date().getTime();
    const dataProcessingTime = endTime - dataCollectionEndTime;
    logger.info(loggerOptions, `Added ${ranking.length} validators in ${((dataCollectionTime + dataProcessingTime) / 1000).toFixed(3)}s`);
    logger.info(loggerOptions, `Next execution in ${(config.pollingTime / 60000).toFixed(0)}m...`);
    setTimeout(
      () => module.exports.start(wsProviderUrl, pool, config),
      config.pollingTime,
    );
  },
};
