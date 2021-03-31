<template>
  <div>
    <b-alert v-if="!loading" class="text-center" show dismissible>
      <h4>Featured waiting validator</h4>
      <p>
        Including some waiting validators in your set incentivize the
        decentralization of the network, also waiting validators can produce
        increased rewards when they become active.
      </p>
      <Identicon :address="featured.stashAddress" :size="24" />
      <nuxt-link :to="`/validator/${featured.stashAddress}`">
        <span v-if="featured.name">{{ featured.name }}</span>
        <span v-else>{{ shortAddress(featured.stashAddress) }}</span>
      </nuxt-link>
      <VerifiedIcon v-if="featured.verifiedIdentity" />
      <b-button
        :disabled="disabled"
        variant="outline-primary"
        @click="toggleSelected(featured.stashAddress)"
        >Add to your set</b-button
      >
    </b-alert>
  </div>
</template>
<script>
import commonMixin from '@/mixins/commonMixin.js'
export default {
  mixins: [commonMixin],
  data() {
    return {
      disabled: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    featured() {
      const inactiveValidators = this.$store.state.ranking.list
        .filter(({ active }) => !active)
        .map(({ rank }) => rank)
        .slice(0, 10)
      const shuffled = [...inactiveValidators].sort(() => 0.5 - Math.random())
      const randomRank = shuffled[0]
      return this.$store.state.ranking.list.find(
        ({ rank }) => rank === randomRank
      )
    },
  },
  methods: {
    toggleSelected(accountId) {
      this.$store.dispatch('ranking/toggleSelected', { accountId })
      this.disabled = true
    },
  },
}
</script>
