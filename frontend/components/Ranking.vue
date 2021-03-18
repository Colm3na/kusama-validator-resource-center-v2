<template>
  <div>
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else class="ranking">
      <!-- Selected validators  -->
      <b-row v-if="config.showValSelectorInPage">
        <b-col offset-lg="9" cols="12" lg="3">
          <b-dropdown
            id="selected-validators"
            ref="selectedValidators"
            class="selected-validators"
            toggle-class="btn btn-block btn-selected mb-3"
            right
          >
            <template #button-content>
              <span v-if="loading">Selected</span>
              <span v-else>
                {{ selectedValidatorAddresses.length }}/16 selected
              </span>
              <font-awesome-icon icon="hand-paper" />
            </template>
            <SelectedValidators />
          </b-dropdown>
        </b-col>
      </b-row>
      <!-- Exclude -->
      <div class="exclude mb-4">
        <div class="row">
          <div class="col-11">
            <h5 class="exclude-title mb-2">
              Exclude from search:
              <nuxt-link
                v-b-tooltip.hover
                to="/help#exclude-filter"
                title="You can exclude groups of validators based on your preferences"
              >
                <font-awesome-icon
                  icon="question-circle"
                  class="d-inline-block"
                  style="font-size: 1rem"
                />
              </nuxt-link>
            </h5>
          </div>
          <div class="col-1 text-right">
            <span v-b-toggle.exclude-filter-collapse class="m-1">
              <font-awesome-icon icon="chevron-up" class="when-open" />
              <font-awesome-icon icon="chevron-down" class="when-closed" />
            </span>
          </div>
        </div>
        <b-collapse id="exclude-filter-collapse" visible>
          <div class="row pt-3">
            <div
              v-for="option in options"
              :key="option.text"
              class="col-md-6 col-lg-3 mb-2"
            >
              <b-form-checkbox
                switch
                size="lg"
                :checked="getExcludeState(option.value)"
                @change="toggleExcluded(option.value)"
              >
                {{ option.text }}
              </b-form-checkbox>
            </div>
          </div>
        </b-collapse>
      </div>
      <!-- Customize VRC score -->
      <div class="exclude mb-4">
        <div class="row">
          <div class="col-11">
            <h5 class="exclude-title mb-2">
              Customize VRC score:
              <nuxt-link
                v-b-tooltip.hover
                to="/help#custom-vrc-score"
                title="You can customize the weights of the VRC score and thereby deviate from the default option (equal weight of each metric)"
              >
                <font-awesome-icon
                  icon="question-circle"
                  class="d-inline-block"
                  style="font-size: 1rem"
                />
              </nuxt-link>
            </h5>
          </div>
          <div class="col-1 text-right">
            <span v-b-toggle.custom-vrc-score-collapse class="m-1">
              <font-awesome-icon icon="chevron-up" class="when-open" />
              <font-awesome-icon icon="chevron-down" class="when-closed" />
            </span>
          </div>
        </div>
        <b-collapse id="custom-vrc-score-collapse" visible>
          <div class="row mt-2">
            <div class="col-12">
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      ACTIVE -
                      <span style="color: gray"
                        >x{{ metricWeights.active }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.active"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      COMMISSION -
                      <span style="color: gray"
                        >x{{ metricWeights.commission }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.commission"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      ERA POINTS AVG -
                      <span style="color: gray"
                        >x{{ metricWeights.eraPoints }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.eraPoints"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      GOVERNANCE -
                      <span style="color: gray"
                        >x{{ metricWeights.governance }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.governance"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      IDENTITY -
                      <span style="color: gray"
                        >x{{ metricWeights.identity }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.identity"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      NOMINATORS -
                      <span style="color: gray"
                        >x{{ metricWeights.nominators }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.nominators"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      ADDRES CREATION -
                      <span style="color: gray"
                        >x{{ metricWeights.address }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.address"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      PAYOUTS -
                      <span style="color: gray"
                        >x{{ metricWeights.payout }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.payout"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      SLASHES -
                      <span style="color: gray"
                        >x{{ metricWeights.slashes }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.slashes"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-6">
                      SUBACCOUNTS -
                      <span style="color: gray"
                        >x{{ metricWeights.subaccounts }}</span
                      >
                    </div>
                    <div class="col-6">
                      <b-form-input
                        v-model="metricWeights.subaccounts"
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        style="width: 5rem"
                        @change="updateVCRScore()"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-collapse>
      </div>
      <!-- Auto-Filter -->
      <div class="exclude mb-4">
        <div class="row mb-2">
          <div class="col-11">
            <h5 class="exclude-title">
              Auto-Filter validators:
              <nuxt-link
                v-b-tooltip.hover
                to="/help#auto-filter"
                title="Auto-filter of quantitatively dominated validators. Explanation: A validator X is dominated by another validator Y if all Y’s quantitatively metrics are at least equally good and at least one metric is strictly better"
              >
                <font-awesome-icon
                  icon="question-circle"
                  class="d-inline-block"
                  style="font-size: 1rem"
                />
              </nuxt-link>
            </h5>
          </div>
          <div class="col-1 text-right">
            <span v-b-toggle.auto-filter-collapse class="m-1">
              <font-awesome-icon icon="chevron-up" class="when-open" />
              <font-awesome-icon icon="chevron-down" class="when-closed" />
            </span>
          </div>
        </div>
        <b-collapse id="auto-filter-collapse" visible>
          <div class="text-center mt-0 mb-4">
            <b-form-checkbox
              switch
              size="lg"
              class="xl-switch"
              :checked="true"
            />
          </div>
        </b-collapse>
      </div>
      <!-- Filter -->
      <b-row>
        <b-col cols="12">
          <b-form-input
            id="filterInput"
            v-model="filter"
            type="search"
            placeholder="Search validator by address or name"
            debounce="500"
            class="mb-3"
          />
        </b-col>
      </b-row>
      <!-- Search results -->
      <b-row>
        <b-col cols="6">
          <p class="mb-2 text-secondary">
            Search results: {{ filteredRows }} / {{ ranking.length }}
          </p>
        </b-col>
        <b-col cols="6" class="text-right">
          <!-- <JsonCSV
            :data="rankingJSON"
            class="csv-export mb-2"
            name="kusama_validator_ranking.csv"
          >
            <font-awesome-icon icon="file-csv" />
            export to CSV file
          </JsonCSV> -->
        </b-col>
      </b-row>
      <!-- Ranking table -->
      <b-table
        dark
        hover
        :fields="fields"
        :items="filteredRanking"
        :per-page="perPage"
        :current-page="currentPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :filter="filter"
        :filter-included-fields="filterOn"
        :sort-compare="sortCompare"
        :filter-debounce="500"
        :filter-ignored-fields="[
          'active',
          'commission',
          'selfStake',
          'totalStake',
          'relativePerformance',
          'totalRating',
          'selected',
        ]"
        @filtered="onFiltered"
      >
        <template #cell(active)="data">
          <span
            v-if="data.item.active"
            v-b-tooltip.hover
            title="Elected validator"
          >
            <font-awesome-layers class="align-middle">
              <font-awesome-icon icon="circle" class="elected-icon" />
              <font-awesome-icon
                icon="circle"
                class="text-success"
                style="font-size: 1.05rem; margin-left: 0.266rem"
                transform="shrink-6"
              />
            </font-awesome-layers>
          </span>
          <span v-else v-b-tooltip.hover title="Not elected validator">
            <font-awesome-layers>
              <font-awesome-icon icon="circle" class="not-elected-icon" />
              <font-awesome-icon
                icon="circle"
                class="text-danger"
                style="font-size: 1.05rem; margin-left: 0.266rem"
                transform="shrink-6"
              />
            </font-awesome-layers>
          </span>
        </template>
        <template #cell(name)="data">
          <!-- desktop -->
          <div class="d-none d-sm-none d-md-none d-lg-block d-xl-block">
            <Identicon :address="data.item.stashAddress" :size="24" />
            <nuxt-link :to="`/validator/${data.item.stashAddress}`">
              <span v-if="data.item.name">{{ data.item.name }}</span>
              <span v-else>{{ shortAddress(data.item.stashAddress) }}</span>
            </nuxt-link>
            <VerifiedIcon v-if="data.item.verifiedIdentity" />
          </div>
          <!-- mobile -->
          <div class="d-block d-sm-block d-md-block d-lg-none d-xl-none">
            <b-row>
              <b-col cols="10">
                <Identicon :address="data.item.stashAddress" :size="24" />
                <nuxt-link :to="`/validator/${data.item.stashAddress}`">
                  <span v-if="data.item.name">{{ data.item.name }}</span>
                  <span v-else>{{ shortAddress(data.item.stashAddress) }}</span>
                </nuxt-link>
                <VerifiedIcon v-if="data.item.verifiedIdentity" />
              </b-col>
              <b-col cols="2">
                <a
                  v-b-tooltip.hover
                  class="select"
                  title="Select / Unselect validator"
                  @click="toggleSelected(data.item.stashAddress)"
                >
                  <font-awesome-icon
                    v-if="data.item.selected"
                    icon="hand-paper"
                    class="selected text-selected"
                  />
                  <font-awesome-icon
                    v-else
                    icon="hand-paper"
                    class="unselected text-secondary"
                  />
                </a>
              </b-col>
            </b-row>
          </div>
        </template>
        <template #cell(commission)="data">
          {{ data.item.commission.toFixed(1) }}%
        </template>

        <template #cell(selfStake)="data">
          {{ formatAmount(data.item.selfStake) }}
        </template>
        <template #cell(otherStake)="data">
          {{ formatAmount(data.item.otherStake) }}
        </template>
        <template #cell(relativePerformance)="data">
          <b-progress
            v-b-tooltip.hover
            variant="success"
            :max="100"
            show-progress
            animated
            :title="`${(data.item.relativePerformance * 100).toFixed(2)} %`"
          >
            <b-progress-bar
              :value="data.item.relativePerformance * 100"
              :label="`${(data.item.relativePerformance * 100).toFixed(2)} %`"
            ></b-progress-bar>
          </b-progress>
        </template>
        <template #cell(totalRating)="data">
          <span
            v-b-tooltip.hover
            :title="`
              Active: ${data.item.activeRating}, 
              Subaccounts: ${data.item.subAccountsRating}, 
              Identity: ${data.item.identityRating}, 
              Address: ${data.item.addressCreationRating}, 
              Nominators: ${data.item.nominatorsRating}, 
              Commission: ${data.item.commissionRating}, 
              EraPoints: ${data.item.eraPointsRating}, 
              Slash: ${data.item.slashRating}, 
              Governance: ${data.item.governanceRating}, 
              Payouts: ${data.item.payoutRating}
            `"
            >{{ data.item.totalRating }}</span
          >
        </template>
        <template #cell(selected)="data">
          <p class="text-center mb-0">
            <a
              v-b-tooltip.hover
              class="select"
              title="Select / Unselect validator"
              @click="toggleSelected(data.item.stashAddress)"
            >
              <font-awesome-icon
                v-if="data.item.selected"
                icon="hand-paper"
                class="selected text-selected"
              />
              <font-awesome-icon
                v-else
                icon="hand-paper"
                class="unselected text-secondary"
              />
            </a>
          </p>
        </template>
      </b-table>
      <div class="row">
        <div class="col-6">
          <!-- desktop -->
          <div class="d-none d-sm-none d-md-none d-lg-block d-xl-block">
            <b-button-group>
              <b-button
                variant="outline-secondary"
                :class="{ 'selected-per-page': perPage === 10 }"
                @click="setPageSize(10)"
                >10</b-button
              >
              <b-button
                variant="outline-secondary"
                :class="{ 'selected-per-page': perPage === 50 }"
                @click="setPageSize(50)"
                >50</b-button
              >
              <b-button
                variant="outline-secondary"
                :class="{ 'selected-per-page': perPage === 100 }"
                @click="setPageSize(100)"
                >100</b-button
              >
              <b-button
                variant="outline-secondary"
                :class="{ 'selected-per-page': perPage === 1000 }"
                @click="setPageSize(1000)"
                >All</b-button
              >
            </b-button-group>
          </div>
          <!-- mobile -->
          <div class="d-block d-sm-block d-md-block d-lg-none d-xl-none">
            <b-dropdown
              class="m-md-2"
              text="Page size"
              variant="outline-secondary"
            >
              <b-dropdown-item @click="setPageSize(10)">10</b-dropdown-item>
              <b-dropdown-item @click="setPageSize(50)">50</b-dropdown-item>
              <b-dropdown-item @click="setPageSize(100)">100</b-dropdown-item>
              <b-dropdown-item @click="setPageSize(1000)">All</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        <div class="col-6">
          <b-pagination
            v-model="currentPage"
            :total-rows="filteredRows"
            :per-page="perPage"
            aria-controls="my-table"
            variant="dark"
            align="right"
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BigNumber } from 'bignumber.js'
// import JsonCSV from 'vue-json-csv'
import Loading from '@/components/Loading.vue'
import Identicon from '@/components/Identicon.vue'
import VerifiedIcon from '@/components/VerifiedIcon.vue'
import SelectedValidators from '@/components/SelectedValidators.vue'
import commonMixin from '@/mixins/commonMixin.js'
import { config } from '@/config.js'

export default {
  components: {
    Identicon,
    VerifiedIcon,
    SelectedValidators,
    Loading,
    // JsonCSV,
  },
  mixins: [commonMixin],
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      sortBy: 'rank',
      sortDesc: false,
      fields: [
        {
          key: 'active',
          label: 'Elected',
          sortable: true,
          class:
            'text-center d-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        { key: 'name', sortable: true },
        // {
        //   key: 'nominators',
        //   sortable: true,
        //   class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        // },
        {
          key: 'commission',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'selfStake',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'otherStake',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'relativePerformance',
          label: 'R. Performance',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'totalRating',
          label: 'VRC score',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'customVRCScore',
          label: 'Custom VRC score',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'selected',
          label: 'Select',
          sortable: true,
          class:
            'text-center d-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
      ],
      exclude: [],
      options: [
        { text: 'Not elected', value: 'inactive' },
        { text: '100% commission', value: 'greedy' },
        { text: 'Slashed', value: 'slashed' },
        { text: 'Oversubscribed', value: 'oversubscribed' },
        { text: 'No identity', value: 'noIdentity' },
        { text: 'No verified identity', value: 'noVerifiedIdentity' },
        { text: 'No auto-payout', value: 'noAutoPayout' },
        {
          text: 'Below average era points',
          value: 'belowAverageEraPoints',
        },
        {
          text: 'No participation in governance',
          value: 'noParticipateGovernance',
        },
      ],
      filter: null,
      filterOn: [],
      rows: 0,
      maxValidatorsReached: false,
      polling: null,
      config,
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
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    ranking() {
      return this.$store.state.ranking.list.map((validator) => {
        return {
          ...validator,
          selected: this.isSelected(validator.stashAddress),
        }
      })
    },
    // rankingJSON() {
    //   return this.$store.state.ranking.list.map((validator) => {
    //     return {
    //       rank: validator.rank,
    //       name: validator.name,
    //       stash_address: validator.stashAddress,
    //       controller_address: validator.controllerAddress,
    //       active: validator.active ? 'active' : 'inactive',
    //       active_rating: validator.activeRating,
    //       self_stake: validator.selfStake,
    //       other_stake: validator.otherStake,
    //       total_stake: validator.totalStake,
    //       has_sub_identity: validator.hasSubIdentity ? 'yes' : 'no',
    //       sub_accounts_rating: validator.subAccountsRating,
    //       verified_identity: validator.verifiedIdentity ? 'yes' : 'no',
    //       identity_rating: validator.identityRating,
    //       commission: validator.commission,
    //       commission_history: validator.commissionHistory
    //         .map(({ era, commission }) => `${era}=${commission}`)
    //         .join(','),
    //       commission_rating: validator.commissionRating,
    //       nominators: validator.nominators,
    //       nominators_rating: validator.nominatorsRating,
    //       active_eras: validator.activeEras,
    //       era_points_history: validator.eraPointsHistory
    //         .map(({ era, points }) => `${era}=${points}`)
    //         .join(','),
    //       era_points_percentage: validator.eraPointsPercent,
    //       era_points_rating: validator.eraPointsRating,
    //       performance: validator.performance,
    //       relative_performance: validator.relativePerformance,
    //       slashed: validator.slashed ? 'yes' : 'no',
    //       slashes: validator.slashes,
    //       slash_rating: validator.slashRating,
    //       part_of_a_cluster: validator.partOfCluster ? 'yes' : 'no',
    //       cluster_name: validator.clusterName,
    //       cluster_members: validator.clusterMembers,
    //       council_backing: validator.councilBacking ? 'yes' : 'no',
    //       active_in_governance: validator.activeInGovernance ? 'yes' : 'no',
    //       governance_rating: validator.governanceRating,
    //       payout_history: validator.payoutHistory
    //         .map(({ era, status }) => `${era}=${status}`)
    //         .join(','),
    //       payout_rating: validator.payoutRating,
    //       total_rating: validator.totalRating,
    //       selected: this.isSelected(validator.stashAddress) ? 'yes' : 'no',
    //     }
    //   })
    // },
    selectedValidatorAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
    selectedValidators() {
      return this.ranking.filter(({ stashAddress }) =>
        this.$store.state.ranking.selectedAddresses.includes(stashAddress)
      )
    },
    filteredRanking() {
      let filteredRanking = this.exclude.includes('inactive')
        ? this.ranking.filter(({ active }) => active)
        : this.ranking
      filteredRanking = this.exclude.includes('greedy')
        ? filteredRanking.filter(({ commission }) => commission !== 100)
        : filteredRanking
      filteredRanking = this.exclude.includes('noIdentity')
        ? filteredRanking.filter(({ name }) => name !== '')
        : filteredRanking
      filteredRanking = this.exclude.includes('noVerifiedIdentity')
        ? filteredRanking.filter(({ verifiedIdentity }) => verifiedIdentity)
        : filteredRanking
      filteredRanking = this.exclude.includes('noAutoPayout')
        ? filteredRanking.filter(({ payoutRating }) => payoutRating === 3)
        : filteredRanking
      filteredRanking = this.exclude.includes('noParticipateGovernance')
        ? filteredRanking.filter(
            ({ governanceRating }) => governanceRating !== 0
          )
        : filteredRanking
      filteredRanking = this.exclude.includes('belowAverageEraPoints')
        ? filteredRanking.filter(({ eraPointsRating }) => eraPointsRating === 2)
        : filteredRanking
      return filteredRanking
    },
    filteredRows() {
      return this.filter ? this.rows : this.filteredRanking.length
    },
  },
  watch: {
    exclude(exclude) {
      this.$cookies.set(`${config.name}-exclude`, exclude, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    },
  },
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/updateList')
    }
    if (this.$cookies.get(`${config.name}-exclude`)) {
      this.exclude = this.$cookies.get(`${config.name}-exclude`)
    }
    if (this.$cookies.get(`${config.name}-filter`)) {
      this.filter = this.$cookies.get(`${config.name}-filter`)
    }
    // update ranking every 30 min
    this.polling = setInterval(async () => {
      // eslint-disable-next-line
      console.log('refreshing...')
      await this.$store.dispatch('ranking/updateList')
    }, 1800 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  methods: {
    setPageSize(size) {
      this.perPage = size
    },
    isSelected(accountId) {
      return this.selectedValidatorAddresses.includes(accountId)
    },
    toggleSelected(accountId) {
      this.$store.dispatch('ranking/toggleSelected', { accountId })
    },
    toggleExcluded(value) {
      if (this.exclude.includes(value)) {
        this.exclude.splice(this.exclude.indexOf(value), 1)
      } else {
        this.exclude.push(value)
      }
    },
    getExcludeState(value) {
      if (this.exclude.includes(value)) {
        return true
      }
      return false
    },
    onFiltered(filteredItems) {
      this.rows = filteredItems.length
      this.currentPage = 1
      // update cookie
      this.$cookies.set(`${config.name}-filter`, this.filter, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    },
    sortCompare(aRow, bRow, key) {
      const a = aRow[key]
      const b = bRow[key]
      if (a instanceof BigNumber && b instanceof BigNumber) {
        return a.lt(b) ? -1 : 1
      } else if (typeof a === 'number' && typeof b === 'number') {
        return a < b ? -1 : 1
      }
      return a.toString().localeCompare(b.toString())
    },
    async updateVCRScore() {
      await this.$store.dispatch(
        'ranking/updateMetricWeights',
        JSON.parse(JSON.stringify(this.metricWeights))
      )
    },
  },
}
</script>

<style>
.xl-switch {
  /* Double-sized Checkboxes */
  -ms-transform: scale(2); /* IE */
  -moz-transform: scale(2); /* FF */
  -webkit-transform: scale(2); /* Safari and Chrome */
  -o-transform: scale(2); /* Opera */
  transform: scale(2); /* Opera */
  padding: 10px;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
