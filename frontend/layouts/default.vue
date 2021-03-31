<template>
  <div id="wrapper" class="d-flex" :class="{ toggled }">
    <Sidebar :toggled="toggled" />
    <div id="page-content-wrapper">
      <Header @toggle="toggleSidebar()" />
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import { config } from '@/config.js'
export default {
  components: {
    Header,
    Sidebar,
    Footer,
  },
  data() {
    return {
      toggled: false,
    }
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
    // update ranking every 1 min
    this.polling = setInterval(async () => {
      // eslint-disable-next-line
      console.log('refreshing...')
      await this.$store.dispatch('ranking/updateList')
    }, 60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  methods: {
    toggleSidebar() {
      this.toggled = !this.toggled
    },
  },
}
</script>
