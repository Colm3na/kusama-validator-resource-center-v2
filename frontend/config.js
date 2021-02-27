export const config = {
  name: 'kusama',
  title: 'Validator resource center and ranking',
  nodeWs: 'wss://kusama-rpc.polkadot.io',
  denom: 'KSM',
  addressPrefix: 2,
  tokenDecimals: 12,
  historySize: 28, // 1 week
  erasPerDay: 4,
  polkascanAPI: 'https://explorer-31.polkascan.io/kusama/api/v1', // no trailing slash
  theme: '@/assets/scss/themes/kusama.scss',
  identiconTheme: 'polkadot',
  logo: 'img/logo/kusama.svg',
  favicon: 'img/favicon/kusama.ico',
  baseURL: '/',
  showValSelectorInPage: false, // set to false when showing val selector in header
  googleAnalytics: 'UA-143271520-2',
}
