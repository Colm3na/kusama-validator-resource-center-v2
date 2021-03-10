<template>
  <div class="page container-fluid pt-3">
    <div>
      <h1 class="mb-4">Dashboard</h1>
      <b-alert variant="warning" show dismissible>
        <p class="text-center mb-2 mt-2">
          <strong>WARNING!</strong> mocked data
        </p>
      </b-alert>
      <div class="row text-center dashboard-global-stats">
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="box">
            <h4>Validators</h4>
            <span class="stat">900/900</span>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="box">
            <h4>Current era</h4>
            <span class="stat">1786</span>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="box">
            <h4>Nominators</h4>
            <span class="stat">7000</span>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="box">
            <h4>Mininum stake</h4>
            <span class="stat">1 KSM</span>
          </div>
        </div>
      </div>
      <line-chart
        :data="scoreChartData"
        :options="scoreChartOptions"
        :height="160"
        class="py-4"
        style="background-color: rgba(0, 0, 0, 1)"
      />
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
