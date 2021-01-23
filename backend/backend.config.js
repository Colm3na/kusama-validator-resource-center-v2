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
      module: require('./lib/crawlers/blockListener'),
    },
    {
      enabled: !process.env.CRAWLER_BLOCK_HARVESTER_DISABLE,
      module: require('./lib/crawlers/blockHarvester'),
      config: {
        pollingTime:
          parseInt(process.env.CRAWLER_BLOCK_LISTENER_POLLING_TIME_MS) ||
          60 * 60 * 1000,
      },
    },
    {
      enabled: !process.env.CRAWLER_STAKING_DISABLE,
      module: require('./lib/crawlers/staking'),
      config: {
        pollingTime:
          parseInt(process.env.CRAWLER_STAKING_POLLING_TIME_MS) ||
          5 * 60 * 1000,
        historySize: 84,
      },
    },
  ],
};
