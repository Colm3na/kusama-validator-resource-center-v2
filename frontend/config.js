export const config = {
  name: 'polkadot',
  title: 'Validator Resource Center and Ranking',
  nodeWs: 'wss://kusama-rpc.polkadot.io',
  denom: 'DOT',
  addressPrefix: 2,
  tokenDecimals: 10,
  historySize: 84, // 21 days
  erasPerDay: 1,
  validatorSetSize: 24,
  theme: '@/assets/scss/themes/polkadot.scss',
  identiconTheme: 'polkadot',
  logo: 'img/logo/polkadot.svg',
  favicon: 'img/favicon/polkadot.ico',
  baseURL: '/',
  showValSelectorInPage: false, // set to false when showing val selector in header
  googleAnalytics: '',
  backendWs: 'wss://validators.polkadot.polkastats.io/api/v3',
  backendHttp: 'https://validators.polkadot.polkastats.io/api/v3',
}
