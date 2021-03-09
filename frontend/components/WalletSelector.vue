<template>
  <div class="wallet-selector">
    <h3>Select your wallet:</h3>
    <div v-for="address in extensionAddresses" :key="address">
      <p>Address {{ address }}</p>
    </div>
  </div>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from '@polkadot/extension-dapp'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { encodeAddress } from '@polkadot/keyring'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
// import { Promised } from 'vue-promised'
// import Identicon from '@/components/Identicon.vue'
import commonMixin from '@/mixins/commonMixin.js'
import { config } from '@/config.js'

export default {
  // components: { Identicon, Promised },
  mixins: [commonMixin, validationMixin],
  data() {
    return {
      config,
      favorites: [],
      detectedExtension: false,
      extensionAccounts: [],
      extensionAddresses: [],
      selectedAccount: null,
      selectedAddress: null,
      tranferableBalance: 0,
      api: null,
      enableWeb3: false,
      error: null,
      amount: 0,
      extrinsicHash: null,
      extrinsicStatus: null,
      blockHash: null,
      success: null,
      noAccountsFound: true,
      addressRole: null,
      onGoingElection: false,
      clusterAlert: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    list() {
      const list = this.$store.state.ranking.list.filter(({ stashAddress }) =>
        this.selectedAddresses.includes(stashAddress)
      )
      const vm = this
      list.forEach((validator) => {
        const includedClusterMembers = list.filter(
          ({ clusterName }) => clusterName === validator.clusterName
        )
        if (includedClusterMembers.length > 1) {
          vm.clusterAlert = true
        }
      })
      return list
    },
    selectedAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
  },
  validations: {
    selectedAddress: {
      required,
    },
  },
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/update')
    }
    this.enableWeb3 = await web3Enable(
      `${config.title} for ${this.capitalize(config.name)}`
    )
      .then(() => {
        web3Accounts()
          .then((accounts) => {
            const wsProvider = new WsProvider(config.nodeWs)
            ApiPromise.create({ provider: wsProvider }).then((api) => {
              this.api = api
              this.getElectionStatus()
              if (accounts.length > 0) {
                this.detectedExtension = true
                this.extensionAccounts = accounts
                accounts.forEach((account) =>
                  this.extensionAddresses.push(
                    encodeAddress(account.address, config.addressPrefix)
                  )
                )
                if (
                  this.extensionAccounts.length > 0 &&
                  this.extensionAddresses.length > 0
                ) {
                  this.selectedAccount = this.extensionAccounts[0]
                  this.selectedAddress = this.extensionAddresses[0]
                  this.getAccountInfo(this.selectedAddress)
                  this.noAccountsFound = false
                } else {
                  this.noAccountsFound = true
                }
              }
            })
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log('Error: ', error)
          })
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log('Error: ', error)
      })
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v[name]
      return $dirty ? !$error : null
    },
    onSubmit(evt) {
      evt.preventDefault()
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      this.nominate()
    },
    async getAccountInfo(address) {
      const { availableBalance } = await this.api.derive.balances.all(address)
      this.tranferableBalance = new BigNumber(availableBalance)
      this.addressRole = await this.getAddressRole(address)
    },
    async getAddressRole(address) {
      const bonded = await this.api.query.staking.bonded(address)
      if (bonded.toString() && bonded.toString() === address) {
        return `stash/controller`
      } else if (bonded.toString() && bonded.toString() !== address) {
        return `stash`
      } else {
        const stakingLedger = await this.api.query.staking.ledger(address)
        if (stakingLedger.toString()) {
          return `controller`
        } else {
          return `none`
        }
      }
    },
    async getBlockNumber(hash) {
      const { number } = await this.api.rpc.chain.getHeader(hash)
      return number
    },
    async getElectionStatus() {
      const eraElectionStatus = await this.api.query.staking.eraElectionStatus()
      this.onGoingElection = eraElectionStatus.isOpen
    },
    nominate() {
      this.selectedAccount = encodeAddress(this.selectedAddress, 42)
      web3FromAddress(this.selectedAccount)
        .then(async (injector) => {
          this.api.setSigner(injector.signer)
          const { nonce } = await this.api.query.system.account(
            this.selectedAddress
          )
          await this.api.tx.staking
            .nominate(this.selectedAddresses)
            .signAndSend(
              this.selectedAccount,
              { nonce },
              ({ events = [], status }) => {
                this.extrinsicStatus = status.type
                if (status.isInBlock) {
                  this.extrinsicHash = status.asInBlock.toHex()
                } else if (status.isFinalized) {
                  this.blockHash = status.asFinalized.toHex()
                }
              }
            )
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('Error: ', error)
        })
    },
    remove(accountId) {
      this.$store.dispatch('ranking/toggleSelected', { accountId })
    },
    selectAddress(accountId) {
      this.selectedAddress = accountId
    },
  },
}
</script>

<style>
.wallet-selector {
  color: gray;
}
</style>
