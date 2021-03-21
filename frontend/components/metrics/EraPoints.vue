<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">
          Era points
          <nuxt-link
            v-b-tooltip.hover
            to="/help/metrics#erapoints"
            title="Evaluate if the era points earned by the validator in the history are below or above average"
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
        <Rating key="erapoints" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="rating === 2">
        Above average! Validator got {{ percent.toFixed(2) }}% of the total era
        points in the last 21 days while average was
        {{ average.toFixed(2) }}%<br />
      </p>
      <p v-else>
        Below average! Validator got {{ percent.toFixed(2) }}% of the total era
        points in the last 21 days while average was
        {{ average.toFixed(2) }}%<br />
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
    rating: {
      type: Number,
      default: () => 0,
    },
    eraPointsHistory: {
      type: Array,
      default: () => [],
    },
    average: {
      type: Number,
      default: () => 0,
    },
    percent: {
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
        labels: this.eraPointsHistory.map(({ era }) => era),
        datasets: [
          {
            labels: 'commission',
            data: this.eraPointsHistory.map(({ points }) => points),
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
