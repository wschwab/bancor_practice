require('dotenv').config();
const BancorSDK = require('@bancor/sdk').SDK;
const fs = require('fs');
const ethers = require('ethers');
const vortexAbi = require('./vortexRegistry.json')

async function main() {
  const CONTRACT_REGISTRY_ADDRESS = "0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4";

  const CONTRACT_REGISTRY_ABI = [
      {"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"addressOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  ];

  const CONVERTER_REGISTRY_ABI = [
      {"inputs":[],"name":"getAnchors","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  ]

  const CONVERTER_ABI = [
      {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"connectorTokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  ];

  const TOKEN_ABI = [
      {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  ];

  const provider = new ethers.providers.InfuraProvider(null, process.env.INFURA);
  const settings = {
    ethereumNodeEndpoint: `https://mainnet.infura.io/v3/${process.env.INFURA}`
  };
  // const converter = {
  //   blockchainType: 'ethereum',
  //   blockchainId: '0x3839416bd0095d97bE9b354cBfB0F6807d4d609E' // v0.9
  //   // blockchainID: '0x3839416bd0095d97bE9b354cBfB0F6807d4d609E' // v0.7
  // };
  let bancorSDK = await BancorSDK.create(settings);
  // const version = await bancorSDK.utils.getConverterVersion(converter);
  // console.log(`Converter version: ${version}`);
  // const vortexRegistry = new ethers.Contract(
  //   "0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4",
  //   vortexAbi,
  //   provider
  // );
  // let converters = [];
  // const converterNames = await vortexRegistry.contractNames();
  // // const convertersLength = (vortexRegistry.itemCount()).toNumber();
  // converterNames.forEach(async converterName => {
  //   const bytes32ofName = await vortexRegistry.stringtoBytes32(converterName);
  //   const address = await vortexRegistry.addressOf(bytes32ofName);
  //   const version = await bancorSDK.utils.getConverterVersion(address);
  //   converters.push({ address, version });
  // })
  // fs.appendFile('converters.json', `{ converters: ${converters}}`);

  const contractRegistry = new ethers.Contract(CONTRACT_REGISTRY_ADDRESS, CONTRACT_REGISTRY_ABI, provider);
  const converterRegistryAddress = await contractRegistry.addressOf(ethers.utils.formatBytes32String("BancorConverterRegistry"));
  console.log("converter registry address: ", converterRegistryAddress);
  const liquidityProtectionAddress = await contractRegistry.addressOf(ethers.utils.formatBytes32String("LiquidityProtection"));
  console.log("liquidity protection address: ", liquidityProtectionAddress);
  const liquidityProtectionStoreAddress = await contractRegistry.addressOf(ethers.utils.formatBytes32String("LiquidityProtectionStore"));
  console.log("liquidity protection store address: ", liquidityProtectionStoreAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    // tslint:disable-next-line: no-console
    console.error(error);
    process.exit(1);
  });