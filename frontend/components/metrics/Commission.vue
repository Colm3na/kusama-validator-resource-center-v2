<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">
          Commission
          <nuxt-link
            v-b-tooltip.hover
            to="/help/metrics#commission"
            title="Evaluate validator commission over time"
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
        <Rating key="commission" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="!isNaN(commission)">
        Current commission is {{ commission.toFixed(2) }}%
      </p>
      <line-chart
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
export default {
  components: {
    Rating,
  },
  props: {
    commission: {
      type: Number,
      default: () => 0,
    },
    commissionHistory: {
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
                suggestedMax: 100,
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
        labels: this.commissionHistory.map(({ era }) => era),
        datasets: [
          {
            labels: 'commission',
            data: this.commissionHistory.map(({ commission }) => commission),
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(230, 0, 122, 0.8)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: false,
            showLine: true,
          },
        ],
      }
    },
  },
}
</script>
