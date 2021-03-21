<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">
          Frequency of payouts
          <nuxt-link
            v-b-tooltip.hover
            to="/help/metrics#payouts"
            title="Evaluate frequency of rewards distribution"
          >
            <font-awesome-icon
              icon="question-circle"
              class="d-inline-block"
              style="font-size: 1rem"
            />
          </nuxt-link>
        </h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="payouts" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="rating === 3">
        Very good, validator has {{ pending }} unclaimed era rewards
      </p>
      <p v-else-if="rating === 2">
        Good, validator has {{ pending }} unclaimed era rewards
      </p>
      <p v-else-if="rating === 1">
        Neutral, validator has {{ pending }} unclaimed era rewards
      </p>
      <p v-else>No payouts detected in the last week</p>
      <bar-chart
        :data="chartData"
        :options="chartOptions"
        :height="200"
        style="background-color: rgba(0, 0, 0, 1)"
      />
    </div>
  </div>
</template>
<script>
import Rating from '@/components/Rating.vue'
import { config } from '@/config.js'
export default {
  components: {
    Rating,
  },
  props: {
    payoutHistory: {
      type: Array,
      default: () => [],
    },
    rating: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      config,
      chartOptions: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          // text: 'history',
          fontSize: 24,
          fontColor: '#fff',
        },
        tooltips: {
          backgroundColor: '#000000',
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 1,
              },
              gridLines: {
                display: true,
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          ],
        },
      },
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.payoutHistory.map(({ era }) => era),
        datasets: [
          {
            labels: 'payments',
            data: this.payoutHistory.map(({ status }) =>
              status === 'paid' ? 1 : -1
            ),
            backgroundColor: 'rgba(230, 0, 122, 0.8)',
            borderColor: 'rgba(230, 0, 122, 0.8)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: true,
            showLine: true,
          },
        ],
      }
    },
    pending() {
      // eslint-disable-next-line no-console
      console.log(this.payoutHistory)
      return this.payoutHistory.filter((payout) => payout.status === 'pending')
        .length
    },
  },
}
</script>
