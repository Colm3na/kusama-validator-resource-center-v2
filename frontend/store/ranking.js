import gql from 'graphql-tag'
import { BToast } from 'bootstrap-vue'
import { config } from '@/config.js'

export const state = () => ({
  list: [],
  eraHistory: [],
  blockHeight: 0,
  eraPointsHistoryTotalsSum: 0,
  eraPointsAverage: 0,
  loading: true,
  selectedAddresses: [], // validators
  selectedAddress: undefined, // staking address
  metricWeights: {
    active: 1,
    commission: 1,
    eraPoints: 1,
    governance: 1,
    identity: 1,
    nominators: 1,
    address: 1,
    payout: 1,
    slashes: 1,
    subaccounts: 1,
  },
  customVRCScoreEnabled: false,
})

export const getters = {
  getmetricWeights: (state) => state.metricWeights,
}

export const mutations = {
  updateList(state, { ranking, blockHeight, eraPointsAverage, loading }) {
    state.list = ranking
    state.blockHeight = blockHeight
    state.eraPointsAverage = eraPointsAverage
    state.loading = loading
  },
  updateSelectedAddress(state, selectedAddress) {
    state.selectedAddress = selectedAddress
    // eslint-disable-next-line no-console
    console.log('selected address:', state.selectedAddress)
  },
  loadSelected(state) {
    const selectedAddresses =
      this.$cookies.get(`${config.name}-selectedValidatorAddresses`) || []
    state.selectedAddresses = selectedAddresses
  },
  toggleSelected(state, { accountId }) {
    const selectedAddresses = state.selectedAddresses
    if (selectedAddresses.includes(accountId)) {
      selectedAddresses.splice(state.selectedAddresses.indexOf(accountId), 1)
    } else if (selectedAddresses.length < 16) {
      // check if a member of the same cluster is already in the set
      const validator = state.list.find(
        ({ stashAddress }) => accountId === stashAddress
      )
      const clusterMemberAlreadyIncluded = state.list
        .filter(({ stashAddress }) =>
          state.selectedAddresses.includes(stashAddress)
        )
        .some(
          ({ clusterName, partOfCluster }) =>
            partOfCluster && clusterName === validator.clusterName
        )
      if (clusterMemberAlreadyIncluded) {
        const bootStrapToaster = new BToast()
        bootStrapToaster.$bvToast.toast(
          'Selecting more than one member of a cluster is not recommended',
          {
            title: 'Cluster already included!',
            variant: 'warning',
            autoHideDelay: 5000,
            appendToast: false,
          }
        )
      }
      selectedAddresses.push(accountId)
    } else {
      const bootStrapToaster = new BToast()
      bootStrapToaster.$bvToast.toast(
        'Please remove before selecting a new one',
        {
          title: 'Select up to 16 validators',
          variant: 'danger',
          autoHideDelay: 5000,
          appendToast: false,
        }
      )
    }
    state.selectedAddresses = selectedAddresses
    this.$cookies.set(
      `${config.name}-selectedValidatorAddresses`,
      selectedAddresses,
      {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    )
  },
  importValidatorSet(state, validators) {
    state.selectedAddresses = validators
    // eslint-disable-next-line no-console
    console.log('imported validator set:', state.selectedAddresses)
  },
  updateMetricWeights(state, metricWeights) {
    state.metricWeights = metricWeights
    // recalculate custom VRC score
    const list = []
    state.list.forEach((validator) => {
      validator.customVRCScore =
        validator.activeRating * state.metricWeights.active +
        validator.commissionRating * state.metricWeights.commission +
        validator.eraPointsRating * state.metricWeights.eraPoints +
        validator.governanceRating * state.metricWeights.governance +
        validator.identityRating * state.metricWeights.identity +
        validator.nominatorsRating * state.metricWeights.nominators +
        validator.addressCreationRating * state.metricWeights.address +
        validator.payoutRating * state.metricWeights.payout +
        validator.slashRating * state.metricWeights.slashes +
        validator.subAccountsRating * state.metricWeights.subaccounts
      list.push(validator)
    })
    state.list = list
  },
}

export const actions = {
  async updateList(context) {
    const startTime = new Date().getTime()
    const client = this.app.apolloProvider.defaultClient

    const metricWeights = this.getters['ranking/getmetricWeights']

    // eslint-disable-next-line no-console
    console.log(metricWeights)

    // get last block height
    let query = gql`
      query blockHeight {
        ranking(order_by: { block_height: asc }, limit: 1) {
          block_height
        }
      }
    `
    const response = await client.query({ query })
    const blockHeight = response.data.ranking[0].block_height
    query = gql`
      query ranking {
        ranking (where: {block_height: {_eq: "${blockHeight}"}}) {
          active
          active_eras
          active_rating
          address_creation_rating
          commission
          commission_rating
          era_points_percent
          era_points_rating
          governance_rating
          identity_rating
          included_thousand_validators
          name
          nominators
          nominators_rating
          other_stake
          part_of_cluster
          payout_rating
          performance
          rank
          relative_performance
          self_stake
          slash_rating
          stash_address
          sub_accounts_rating
          total_rating
          total_stake
          verified_identity
        }
      }
    `
    const { data } = await client.query({ query })
    const ranking = data.ranking.map((validator) => {
      return {
        active: validator.active,
        activeEras: validator.active_eras,
        activeRating: validator.active_rating,
        addressCreationRating: validator.address_creation_rating,
        commission: parseFloat(validator.commission),
        commissionRating: validator.commission_rating,
        eraPointsPercent: parseFloat(validator.era_points_percent),
        eraPointsRating: validator.era_points_rating,
        governanceRating: validator.governance_rating,
        identityRating: validator.identity_rating,
        includedThousandValidators: validator.included_thousand_validators,
        name: validator.name,
        nominators: validator.nominators,
        nominatorsRating: validator.nominators_rating,
        otherStake: validator.other_stake,
        payoutRating: validator.payout_rating,
        performance: parseFloat(validator.performance),
        rank: validator.rank,
        relativePerformance: parseFloat(validator.relative_performance),
        selfStake: validator.self_stake,
        slashRating: validator.slash_rating,
        stashAddress: validator.stash_address,
        subAccountsRating: validator.sub_accounts_rating,
        totalRating: validator.total_rating,
        totalStake: validator.total_stake,
        verifiedIdentity: validator.verified_identity,
        customVRCScore:
          validator.active_rating * metricWeights.active +
          validator.commission_rating * metricWeights.commission +
          validator.era_points_rating * metricWeights.eraPoints +
          validator.governance_rating * metricWeights.governance +
          validator.identity_rating * metricWeights.identity +
          validator.nominators_rating * metricWeights.nominators +
          validator.address_creation_rating * metricWeights.address +
          validator.payout_rating * metricWeights.payout +
          validator.slash_rating * metricWeights.slashes +
          validator.sub_accounts_rating * metricWeights.subaccounts,
      }
    })
    const eraPointsAverage =
      ranking.reduce(
        (accumulator, { eraPointsPercent }) =>
          accumulator + parseFloat(eraPointsPercent),
        0
      ) / ranking.filter(({ active }) => active === true).length
    // eslint-disable-next-line
    console.log(
      `eraPointsAverage: ${eraPointsAverage.toFixed(6)}`
    )
    context.commit('updateList', {
      ranking,
      blockHeight,
      eraPointsAverage,
      loading: false,
    })
    const dataCollectionEndTime = new Date().getTime()
    const dataCollectionTime = dataCollectionEndTime - startTime
    // eslint-disable-next-line
    console.log(
      `data collection time: ${(dataCollectionTime / 1000).toFixed(3)}s`
    )
  },
  loadSelected(context) {
    context.commit('loadSelected')
  },
  toggleSelected(context, accountId) {
    context.commit('toggleSelected', accountId)
  },
  updateSelectedAddress(context, accountId) {
    context.commit('updateSelectedAddress', accountId)
  },
  importValidatorSet(context, validators) {
    context.commit('importValidatorSet', validators)
  },
  updateMetricWeights(context, metricWeights) {
    context.commit('updateMetricWeights', metricWeights)
  },
}
