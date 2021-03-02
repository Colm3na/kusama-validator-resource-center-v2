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
  selectedAddresses: [],
})

export const mutations = {
  update(state, { ranking, blockHeight, eraPointsAverage, loading }) {
    state.list = ranking
    state.blockHeight = blockHeight
    state.eraPointsAverage = eraPointsAverage
    state.loading = loading
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
}

export const actions = {
  async update(context) {
    const startTime = new Date().getTime()
    const client = this.app.apolloProvider.defaultClient

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
          active_in_governance
          active_rating
          address_creation_rating
          cluster_members
          cluster_name
          commission
          commission_history
          commission_rating
          controller_address
          council_backing
          era_points_history
          era_points_percent
          era_points_rating
          governance_rating
          has_sub_identity
          identity
          identity_rating
          included_thousand_validators
          name
          nominators
          nominators_rating
          other_stake
          part_of_cluster
          payout_history
          payout_rating
          performance
          rank
          relative_performance
          self_stake
          slash_rating
          slashed
          slashes
          stash_address
          stash_address_creation_block
          stash_parent_address_creation_block
          sub_accounts_rating
          thousand_validator
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
        activeInGovernance: validator.active_in_governance,
        activeRating: validator.active_rating,
        addressCreationRating: validator.address_creation_rating,
        clusterMembers: parseInt(validator.cluster_members),
        clusterName: validator.cluster_name,
        commission: parseFloat(validator.commission),
        commissionHistory: JSON.parse(validator.commission_history),
        commissionRating: validator.commission_rating,
        controllerAddress: validator.controller_address,
        councilBacking: validator.council_backing,
        eraPointsHistory: JSON.parse(validator.era_points_history),
        eraPointsPercent: parseFloat(validator.era_points_percent),
        eraPointsRating: validator.era_points_rating,
        governanceRating: validator.governance_rating,
        hasSubIdentity: validator.has_sub_identity,
        identity: JSON.parse(validator.identity),
        identityRating: validator.identity_rating,
        includedThousandValidators: validator.included_thousand_validators,
        name: validator.name,
        nominators: validator.nominators,
        nominatorsRating: validator.nominators_rating,
        otherStake: validator.other_stake,
        partOfCluster: validator.part_of_cluster,
        payoutHistory: JSON.parse(validator.payout_history),
        payoutRating: validator.payout_rating,
        performance: validator.performance,
        rank: validator.rank,
        relativePerformance: validator.relative_performance,
        selfStake: validator.self_stake,
        slashRating: validator.slash_rating,
        slashed: validator.slashed,
        slashes: JSON.parse(validator.slashes),
        stashAddress: validator.stash_address,
        stashAddressCreationBlock: validator.stash_address_creation_block,
        stashParentAddressCreationBlock:
          validator.stash_parent_address_creation_block,
        subAccountsRating: validator.sub_accounts_rating,
        thousandValidator: JSON.parse(validator.thousand_validator),
        totalRating: validator.total_rating,
        totalStake: validator.total_stake,
        verifiedIdentity: validator.verified_identity,
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
    context.commit('update', {
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
}
