<template>
  <b-navbar type="dark" variant="dark" sticky>
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
          Connect wallet
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
    <b-modal id="wallet-modal">
      <WalletSelector />
    </b-modal>
  </b-navbar>
</template>

<script>
import { config } from '@/config.js'
import SelectedValidators from '@/components/SelectedValidators.vue'
import WalletSelector from '@/components/WalletSelector.vue'
export default {
  components: {
    SelectedValidators,
    WalletSelector,
  },
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
