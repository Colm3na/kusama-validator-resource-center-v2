<template>
  <reactive-line-chart
    :chart-data="chartData"
    :options="chartOptions"
    class="py-4"
    style="height: 400px; background-color: rgba(0, 0, 0, 1)"
  />
</template>

<script>
import gql from 'graphql-tag'
import { config } from '@/config.js'
import commonMixin from '@/mixins/commonMixin.js'
export default {
  mixins: [commonMixin],
  data() {
    return {
      config,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: 'VRC score',
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
                suggestedMax: 25,
              },
              gridLines: {
                display: true,
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          ],
        },
      },
      chartData: null,
      rows: [],
    }
  },
  head() {
    return {
      title: `${config.title} for ${this.capitalize(config.name)}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${config.title} for ${this.capitalize(config.name)}`,
        },
      ],
    }
  },
  methods: {
    getLabels() {
      return this.rows.length > 0
        ? this.rows
            .map(({ era }) => era)
            .filter((v, i, a) => a.indexOf(v) === i)
        : []
    },
    getNetworkAvgData() {
      return this.getLabels().map(
        (era) =>
          this.rows
            .filter((row) => row.era === era)
            .map((v) => parseFloat(v.total_rating))
            .reduce((a, b) => a + b) /
          this.rows.filter((row) => row.era === era).length
      )
    },
  },
  apollo: {
    $subscribe: {
      validator: {
        query: gql`
          subscription era_vrc {
            era_vrc(order_by: { era: asc }) {
              stash_address
              era
              total_rating
            }
          }
        `,
        result({ data }) {
          this.rows = data.era_vrc
          this.chartData = {
            labels: this.getLabels(),
            datasets: [
              {
                label: 'network avg',
                data: this.getNetworkAvgData(),
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(23, 162, 184, 0.8)',
                hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
                fill: false,
                showLine: true,
              },
            ],
          }
        },
      },
    },
  },
}
</script>
