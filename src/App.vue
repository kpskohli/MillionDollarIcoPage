<template>
  <div id="app">
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark bd-navbar">
          <a class="navbar-brand" href="#">Million Dollar ICO Page</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="faq">FAQ</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="press">Press</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">How to</a>
              </li>
              <li class="nav-item">
                <a class="nav-link btn btn-outline-info" v-if="$store.state.gridVis" v-on:click="$store.commit('setVis', 'list')">List View</a>
                <a class="nav-link btn btn-outline-info" v-else v-on:click="$store.commit('setVis', 'grid')">Grid View</a>
              </li>
            </ul>
          </div>
        </nav>
        <nav class="navbar navbar-info bg-info">
          <div class="container">
            <span class="navbar-text">
              <strong>1,000,000 pixels &middot; 0.001 ETH per pixel &middot;</strong> Own a piece of blockchain history!
            </span>
            <div v-if="ready">
                <b>{{$store.state.adsPixels}} pixels sold</b> <button class="btn btn-success" v-on:click="$store.commit('updatePreview', {x: 20, y: 20})" v-if="!$store.state.previewAd">Buy Pixels</button>
              <button class="btn btn-warning" v-if="$store.state.isWalletAddress" v-on:click="withdraw">Withdraw Ether</button>
            </div>
          </div>
        </nav>
      </header>
    <div class="container-fluid">
      

      <template v-if="ready">
        <Homepage v-if="ready" :web3="web3" :contract="contract" :isReadOnly="isReadOnly" :showNSFW="showNSFW" :prerendered="prerendered"></Homepage>
      </template>
      <template v-else>
        <div class="adGrid">
          <p style="text-align: center; padding: 2em; color: #666;">
            Waiting for Web3... (Must be on MainNet or Rinkeby)
          </p>
        </div>
      </template>

      

      <div class="container">
        <div class="info-block">
          <p>
            Ads displayed above are loaded directly from the Ethereum Blockchain. This Decentralized Application (<a href="https://ethereum.stackexchange.com/questions/383/what-is-a-dapp">DApp</a>) does not have a traditional backend. No MVC framework, no SQL database. It's just a JavaScript application served statically from Github which speaks to the Ethereum blockchain using <a href="https://github.com/ethereum/web3.js/">Web3.js</a>. Pretty cool, right?
          </p>
          <p>
            Want to see it in action? <a href="https://gfycat.com/BleakSimilarGermanspaniel">Here's a GIF!</a>
          </p>
          <h3>Blockchain</h3>
          <ul class="list-unstyled">
            <li class="list-item">
              <Dropdown :options="availableNetworks" :default="activeNetwork" @selected="setNetwork" :disabled="!isReadOnly" invalidName="Unsupported Network"></Dropdown>
              <span v-if="!networkConfig.etherscanLink">
                Contract is only on MainNet and Rinkeby.
              </span>
            </li>
            <li class="list-item" v-if="networkConfig.etherscanLink">
              <a :href="networkConfig.etherscanLink" target="_blank">
                Contract on Etherscan
              </a>
            </li>
            <li class="list-item" v-if="$store.state.numNSFW > 0">
              <a v-if="!showNSFW" v-on:click="showNSFW = true">Show NSFW ({{$store.state.numNSFW}})</a>
              <a v-else v-on:click="showNSFW = false">Hide NSFW</a>
            </li>
          </ul>
          
        </div>
      </div>
    </div>
    <footer class="mainfooter" role="contentinfo">
        <!-- <div class="footer-middle">
        <div class="container">
          <h4>Blockchain</h4>
          <ul class="list-inline">
            <li class="list-inline-item">
              <Dropdown :options="availableNetworks" :default="activeNetwork" @selected="setNetwork" :disabled="!isReadOnly" invalidName="Unsupported Network"></Dropdown>
              <span v-if="!networkConfig.etherscanLink">
                Contract is only on MainNet and Rinkeby.
              </span>
            </li>
            <li class="list-inline-item" v-if="networkConfig.etherscanLink">
              <a :href="networkConfig.etherscanLink" target="_blank">
                Contract on Etherscan
              </a>
            </li>
            <li class="list-inline-item" v-if="$store.state.numNSFW > 0">
              <a v-if="!showNSFW" v-on:click="showNSFW = true">Show NSFW ({{$store.state.numNSFW}})</a>
              <a v-else v-on:click="showNSFW = false">Hide NSFW</a>
            </li>
          </ul>
        </div>
        </div> -->
        <div class="footer-bottom">
          <div class="container">
            <p class="text-xs-center">&copy; Copyright 2018 - MillionDollarIcoPage.  All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
</template>

<script>
import Web3 from 'web3'
import contractJSON from 'json-loader!../build/contracts/KetherHomepage.json'

const deployConfig = {
  "TestNet (Rinkeby)": {
    contractAddr: '0x324589bfd4738ab1542da57b4df1d7be6f4c1a33',
    web3Fallback: 'https://rinkeby.infura.io/VZCd1IVOZ1gcPsrc9gd7',
    etherscanLink: 'https://rinkeby.etherscan.io/address/0x324589bfd4738ab1542da57b4df1d7be6f4c1a33',
    prerendered: {
      image: 'https://storage.googleapis.com/storage.thousandetherhomepage.com/rinkeby.png',
      data: 'https://storage.thousandetherhomepage.com/rinkeby.json',
      loadRemoteImages: true,
      loadFromWeb3: true,
    },
  },
  "MainNet": {
    contractAddr: '0x03ad838d4d962fa6b187dc10e8513e595a32f889',
    web3Fallback: 'https://mainnet.infura.io/VZCd1IVOZ1gcPsrc9gd7',
    etherscanLink: 'https://etherscan.io/address/0x03ad838d4d962fa6b187dc10e8513e595a32f889',
    prerendered: {
      image: 'https://storage.googleapis.com/storage.thousandetherhomepage.com/mainnet.png',
      data: 'https://storage.thousandetherhomepage.com/mainnet.json',
      loadRemoteImages: true,
      loadFromWeb3: true,
    },
  }
}
const web3Networks = [
  undefined, 'MainNet', undefined, undefined, 'TestNet (Rinkeby)',
];

const defaultNetwork = 'MainNet';

import Dropdown from './Dropdown.vue'
import Homepage from './Homepage.vue'

function waitForWeb3(options, cb) {
  const web3Fallback = options.web3Fallback || "http://localhost:8545/";

  function getWeb3() {
    let web3 = window.web3;
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider(web3Fallback));
    }
    try {
      if (web3.currentProvider.isConnected()) return web3;
    } catch (_) {
      return null;
    }
  }
  function startWaiting() {
    const interval = setInterval(function() {
      let r = getWeb3()
      if (r) {
        clearInterval(interval)
        cb(r);
      }
    }, 500);
  }
  if (window.web3Loading === true) {
    // Can't do on window load too late.
    startWaiting();
    return;
  }
  window.addEventListener('load', function() {
    window.web3Loading = true;
    startWaiting();
  });
}

export default {
  name: 'app',
  data() {
    return {
      'availableNetworks': deployConfig,
      'activeNetwork': null,
      'networkConfig': {},
      'selecting': false,
      'web3': null,
      'contract': null,
      'ready': false,
      'isReadOnly': false,
      'showNSFW': false,
      'prerendered': null,
      'isOwnerAddress':false,
      'isWithdrawalAddress':false,
      'ownerAddress':null,
      'withdrawalAddress':null
    }
  },
  methods: {
    setNetwork(network) {
      if (this.activeNetwork === network) return;
      this.activeNetwork = network;
      this.ready = false;
      waitForWeb3(deployConfig[network || defaultNetwork], function(web3) {
        // VueJS tries to inspect/walk/observe objects unless they're frozen. This breaks web3.
        this.web3 = Object.freeze(web3);

        this.web3.version.getNetwork(function(error, networkVersion) {
          if (error) throw error;

          if (this.activeNetwork === undefined) {
            this.activeNetwork = web3Networks[networkVersion];
          }

          const providerHost = this.web3.currentProvider.host
          this.isReadOnly = providerHost && providerHost.indexOf('infura.io') !== -1;
          if (this.activeNetwork === undefined) {
            this.isReadOnly = false;
            return;
          }
          
          // Load contract data
          const options = deployConfig[this.activeNetwork];
          this.networkConfig = options;
          const contract = this.web3.eth.contract(contractJSON.abi);
          const contractAt = contract.at(options.contractAddr);
          contractAt._network = this.activeNetwork;
          this.contract = Object.freeze(contractAt);
          this.ready = true;
          this.prerendered = options.prerendered;
          this.contract.getContractOwner(function(err,response){
        if(err){
          console.log(err);
        }
        else{
          this.$store.commit('setOwnerAddress', response);
        
        }
      }.bind(this));
      this.contract.getWithdrawalAddress(function(err,response){
        if(err){
          console.log(err);
        }
        else{
            this.$store.commit('setWalletAddress', response);
         }
      }.bind(this));

          if (web3.currentProvider.isMetaMask) {
            // Poll for network changes, because MetaMask no longer reloads
            const app = this;
            const interval = setInterval(function() {
              web3.version.getNetwork(function(error, newNetworkVersion) {
                if (error || newNetworkVersion !== networkVersion) {
                  clearInterval(interval)
                  app.setNetwork();
                }
              }.bind(this));
            }, 2000);
          }
        }.bind(this))
      }.bind(this));
    },
    withdraw(){
      const account = this.$store.state.activeAccount;
      this.contract.withdraw.sendTransaction({ from: account },function(err, data){
        if(err){
          console.log(err.message);
        } 
        else{
          console.log("Successfully withdrawn");
        }
      });
    }
  },
  created() {
    this.setNetwork();
  },
  components: {
    'Homepage': Homepage,
    'Dropdown': Dropdown
  }
}
</script>

<style lang="scss">
header {
  h2 {
    display: inline-block;
  }
}
.sold {
  display: inline-block;
  margin-left: 5px;
  padding: 5px 10px;
  border-radius: 3px;
  background: #4A90E2;
  color: white;
  font-weight: bold;

  button {
    margin-left: 5px;
  }
}
header {
  margin-bottom: 0.5rem;
}
.navbar-brand {
  font-size: 1.5rem;
  font-weight: bolder;
}
.nav-item {
  font-size: 1.25rem;
  margin: 0 0.75rem !important;
}
.navbar-info {
  max-height: 3rem;
}
footer{
  color: white;
  width: 100%;
}
footer a{
  color: #bfffff;
}
footer a:hover{
  color: white;
}

.footer-bottom{
  background: #3d6277;
  padding: 2em;
}
.footer-top{
  background: #2d4958;  
}
.footer-middle{
   background: #3d6277;
  padding-top: 2em;
  color: white;
}
h3 {
  color: #246648;
  font-size: 1.3rem;
  margin: 0.5em 0;
  font-weight: 600;
}
.list-item {
  margin: 1rem 0 !important;
}
/**Sub Navigation**/
.subnavigation-container{
  background: #3d6277;
}
.subnavigation .nav-link{
  color: white;
  font-weight: bold;
}
.subnavigation-container{
  text-align: center;
}
.subnavigation-container .navbar{
  display: inline-block;
  margin-bottom: -6px; /* Inline-block margin offffset HACK -Gilron */
}
.col-subnav a{
  padding: 1rem 1rem;
  color: white;
  font-weight: bold;
}
.info-block {
  margin: 0 3.5em 1em 3.5em; 
}
.col-subnav .active{
  border-top:5px solid orange;
 background: white;
  color: black;
}
.text-xs-center {
  text-align: center !important;
}
</style>
