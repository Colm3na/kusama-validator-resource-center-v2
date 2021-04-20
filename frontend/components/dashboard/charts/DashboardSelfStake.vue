<template>
  <reactive-line-chart
    :chart-data="chartData"
    :options="chartOptions"
    class="py-4"
    style="height: 400px; background-color: rgba(0, 0, 0, 1)"
  />
</template>

<script>
import { BigNumber } from 'bignumber.js'
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
          text: 'Average self stake',
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
            .map((v) => parseFloat(v.self_stake))
            .reduce((a, b) => a + b) /
          this.rows.filter((row) => row.era === era).length
      )
    },
  },
  apollo: {
    $subscribe: {
      validator: {
        query: gql`
          subscription era_self_stake_avg {
            era_self_stake_avg(order_by: { era: asc }) {
              era
              self_stake_avg
            }
          }
        `,
        result({ data }) {
          this.rows = data.era_self_stake_avg
          this.chartData = {
            labels: [...this.rows.map((row) => row.era)],
            datasets: [
              {
                label: 'network avg self stake',
                data: [
                  ...this.rows.map((row) =>
                    new BigNumber(row.self_stake_avg)
                      .div(new BigNumber(10).pow(config.tokenDecimals))
                      .toNumber()
                  ),
                ],
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
