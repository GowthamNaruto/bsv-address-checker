import { Address } from './lib/address.js';
import bsv from 'bsv';

// const address = new Address();
// console.log(address);
// 1.) Generating random Address form TESTNET
console.log('----------------------------');
console.log('Address derived from Testnet');

const testAddr = Address.Testnet.fromRandom().toString();
console.log(testAddr);
//prints:
// mqzrmgneGvEMmPqpkB7mLWSoam73jSLeMJ

console.log('----------------------------');

// 1.) Generating random Address form MAINNET
console.log('Address derived from Mainnet');
let privateKeyMainnet = bsv.PrivKey.fromRandom();
let publicKeyMainnet = bsv.PubKey.fromPrivKey(privateKeyMainnet);
let addressMainnet = bsv.Address.fromPubKey(publicKeyMainnet);
let address2Mainnet = bsv.Address.fromPrivKey(privateKeyMainnet);

console.log(addressMainnet.toString());
// prints:
// 1JvFXyZMC31ShnD8PSKgN1HKQ2kGQLVpCt

console.log(address2Mainnet.toString());
console.log('----------------------------');
// prints:
// 1JvFXyZMC31ShnD8PSKgN1HKQ2kGQLVpCt
