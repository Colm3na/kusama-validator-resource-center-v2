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
  methods: {
    toggleSidebar() {
      this.toggled = !this.toggled
    },
  },
}
</script>
