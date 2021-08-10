<template>
  <line-chart
    :data="chartData"
    :options="chartOptions"
    :height="200"
    :style="
      config.themeVersion === 'dark'
        ? 'background-color: rgba(0, 0, 0, 1)'
        : 'background-color: rgba(255, 255, 255, 1)'
    "
  />
</template>
<script>
import { config } from '@/config.js'
export default {
  props: {
    eraPointsHistory: {
      type: Array,
      default: () => [],
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
          text: 'era points',
          fontSize: 18,
          fontColor: config.themeVersion === 'dark' ? '#fff' : '#000',
          fontStyle: 'lighter',
        },
        tooltips: {
          backgroundColor: '#000000',
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                color:
                  config.themeVersion === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
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
                color:
                  config.themeVersion === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
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
        labels: this.eraPointsHistory.map(({ era }) => `Era ${era}`),
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
