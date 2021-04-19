<template>
  <div class="page container-fluid pt-3">
    <div>
      <b-alert
        show
        dismissible
        variant="warning"
        class="text-center py-3 glitch"
      >
        <p>
          The {{ config.title }} for {{ capitalize(config.name) }} aims to
          provide quantitative and qualitative data about validators performance
          and help nominators to choose their best nomination set.
        </p>
        <p>
          The size of the
          <strong
            >history is {{ config.historySize }} eras ({{
              config.historySize / config.erasPerDay
            }}
            days)</strong
          >
        </p>
        <p>
          This platform is currently under development and the metrics are
          subject to change. Please do your own research before nominating your
          validator set.
        </p>
      </b-alert>
      <h1 class="mb-4">Dashboard</h1>
      <Stats />
      <DashboardVRCScore />
      <div class="row">
        <div class="col-md-6">
          <DashboardCommission />
        </div>
        <div class="col-md-6">
          <DashboardSelfStake />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <DashboardPerformance />
        </div>
        <div class="col-md-6">
          <DashboardEraPoints />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { config } from '@/config.js'
import commonMixin from '@/mixins/commonMixin.js'
export default {
  mixins: [commonMixin],
  data() {
    return {
      config,
      scoreChartOptions: {
        responsive: true,
        legend: {
          display: false,
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
      scoreChartData: {
        labels: [...Array(84).keys()].map((n) => n + 1),
        datasets: [
          {
            labels: 'current set',
            data: [...Array(84)].map(
              (n) => Math.floor(Math.random() * (20 - 0)) + 0
            ),
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(230, 0, 122, 0.8)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: false,
            showLine: true,
          },
          {
            labels: 'selected set',
            data: [...Array(84)].map(
              (n) => Math.floor(Math.random() * (20 - 0)) + 0
            ),
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(23, 162, 184, 0.8)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: false,
            showLine: true,
          },
        ],
      },
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
}
</script>

<style>
.dashboard-global-stats .stat {
  font-size: 3rem;
  font-weight: 200;
}
.dashboard-global-stats .box {
  padding: 1rem;
  border: 1px solid gray;
}
</style>
