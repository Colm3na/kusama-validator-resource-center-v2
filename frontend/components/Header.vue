<template>
  <b-navbar type="dark" variant="dark">
    <b-container fluid>
      <button id="menu-toggle" class="btn btn-primary" @click="toggleSidebar()">
        <font-awesome-icon icon="bars" />
      </button>
      <b-navbar-nav>
        <button
          v-b-modal.wallet-modal
          type="button"
          class="btn btn-outline-info mr-4"
        >
          <span v-if="selectedAddress">
            <Identicon :address="selectedAddress" :size="24" />
            {{ shortAddress(selectedAddress) }}
          </span>
          <span v-else>Connect wallet</span>
        </button>
        <b-nav-item-dropdown
          id="selected-validators"
          ref="selectedValidators"
          class="selected-validators"
          toggle-class="btn btn-selected"
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
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-container>
    <b-modal id="wallet-modal" size="lg">
      <template #modal-header></template>
      <template #default="{ hide }">
        <WalletSelector @close="hide()" />
        <p class="text-right mt-4 mb-0">
          <b-button class="btn-sm" @click="hide()">Close</b-button>
        </p>
      </template>
      <template #modal-footer></template>
    </b-modal>
  </b-navbar>
</template>

<script>
import { config } from '@/config.js'
import commonMixin from '@/mixins/commonMixin.js'
import SelectedValidators from '@/components/SelectedValidators.vue'
import WalletSelector from '@/components/WalletSelector.vue'
export default {
  components: {
    SelectedValidators,
    WalletSelector,
  },
  mixins: [commonMixin],
  data() {
    return {
      config,
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    selectedValidatorAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
    selectedAddress() {
      return this.$store.state.ranking.selectedAddress
    },
  },
  watch: {
    $route(to, from) {
      this.$refs.selectedValidators.hide(true)
    },
  },
  created() {
    this.$store.dispatch('ranking/loadSelected')
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle')
    },
  },
}
</script>
