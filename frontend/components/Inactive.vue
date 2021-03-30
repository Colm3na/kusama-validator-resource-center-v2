<template>
  <div>
    <b-alert v-if="!loading" class="text-center" show dismissible>
      <h4>Featured inactive validator</h4>
      <p>
        Including some inactive validators in your set incentivize
        decentralization and also can produce increased rewards when they become
        active.
      </p>
      <Identicon :address="featured.stashAddress" :size="24" />
      <nuxt-link :to="`/validator/${featured.stashAddress}`">
        <span v-if="featured.name">{{ featured.name }}</span>
        <span v-else>{{ shortAddress(featured.stashAddress) }}</span>
      </nuxt-link>
      <VerifiedIcon v-if="featured.verifiedIdentity" />
    </b-alert>
  </div>
</template>
<script>
import commonMixin from '@/mixins/commonMixin.js'
export default {
  mixins: [commonMixin],
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
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/updateList')
    }
    // update ranking every min
    this.polling = setInterval(async () => {
      // eslint-disable-next-line
      console.log('refreshing...')
      await this.$store.dispatch('ranking/updateList')
    }, 1 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
}
</script>
