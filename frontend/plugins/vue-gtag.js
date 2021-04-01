import Vue from 'vue'
import VueGtag from 'vue-gtag'
import { config } from '@/config.js'

export default ({ app }) => {
  Vue.use(
    VueGtag,
    {
      config: { id: config.googleAnalytics },
    },
    app.router
  )
}
