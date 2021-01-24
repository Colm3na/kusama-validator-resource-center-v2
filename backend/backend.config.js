require('dotenv').config();

module.exports = {
  substrateNetwork: process.env.SUBSTRATE_NETWORK || 'kusama',
  wsProviderUrl: process.env.WS_PROVIDER_URL || 'ws://substrate-node:9944',
  postgresConnParams: {
    user: process.env.POSTGRES_USER || 'vrc',
    host: process.env.POSTGRES_HOST || 'postgres',
    database: process.env.POSTGRES_DATABASE || 'vrc',
    password: process.env.POSTGRES_PASSWORD || 'vrc',
    port: process.env.POSTGRES_PORT || 5432,
  },
  crawlers: [
    {
      enabled: !process.env.CRAWLER_BLOCK_LISTENER_DISABLE,
      // eslint-disable-next-line global-require
      module: require('./lib/crawlers/blockListener'),
    },
    {
      enabled: !process.env.CRAWLER_BLOCK_HARVESTER_DISABLE,
      // eslint-disable-next-line global-require
      module: require('./lib/crawlers/blockHarvester'),
      config: {
        startDelay: 60 * 1000,
        pollingTime:
          parseInt(process.env.CRAWLER_BLOCK_LISTENER_POLLING_TIME_MS, 10)
          || 60 * 60 * 1000,
      },
    },
    {
      enabled: !process.env.CRAWLER_RANKING_DISABLE,
      // eslint-disable-next-line global-require
      module: require('./lib/crawlers/ranking'),
      config: {
        startDelay: 0,
        pollingTime:
          parseInt(process.env.CRAWLER_RANKING_POLLING_TIME_MS, 10)
          || 5 * 60 * 1000,
        historySize: 84,
        erasPerDay: 4,
      },
    },
  ],
};
