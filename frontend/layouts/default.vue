<template>
  <div>
    <Header />
    <div class="container-fluid">
      <div class="row">
        <div class="col-1">
          <ul class="navbar-nav text-center">
            <li class="nav-item mt-4 mb-4">
              <nuxt-link class="nav-link" to="/dashboard">
                <font-awesome-icon
                  icon="chart-line"
                  style="
                    display: block;
                    font-size: 4rem;
                    margin: 0 auto 0.5rem auto;
                  "
                />
                Dashboard
              </nuxt-link>
            </li>
            <li class="nav-item mb-4">
              <nuxt-link class="nav-link" to="/ranking">
                <font-awesome-icon
                  icon="table"
                  style="
                    display: block;
                    font-size: 4rem;
                    margin: 0 auto 0.5rem auto;
                  "
                />
                Ranking
              </nuxt-link>
            </li>
            <li class="nav-item mb-4">
              <nuxt-link class="nav-link" to="/import">
                <font-awesome-icon
                  icon="file-import"
                  style="
                    display: block;
                    font-size: 4rem;
                    margin: 0 auto 0.5rem auto;
                  "
                />
                Import
              </nuxt-link>
            </li>
            <li class="nav-item mb-4">
              <nuxt-link class="nav-link" to="/nominate">
                <font-awesome-icon
                  icon="hands-helping"
                  style="
                    display: block;
                    font-size: 4rem;
                    margin: 0 auto 0.5rem auto;
                  "
                />
                Nominate
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/help">
                <font-awesome-icon
                  icon="life-ring"
                  style="
                    display: block;
                    font-size: 4rem;
                    margin: 0 auto 0.5rem auto;
                  "
                />
                Help
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="col-11">
          <Nuxt />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
export default {
  components: {
    Header,
    Footer,
  },
}
</script>
