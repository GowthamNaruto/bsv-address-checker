/* global describe,it */
'use strict';
import { Address } from '../lib/address.js';
import { Constants } from '../lib/constants.js';
import { PubKey } from '../lib/pub-key.js';
import { PrivKey } from '../lib/priv-key.js';
import { Script } from '../lib/script.js';
import should from 'should';

describe('Address', function () {
  const pubKeyHash = Buffer.from(
    '3c3fa3d4adcaf8f52d5b1843975e122548269937',
    'hex'
  );
  const versionByteNum = 0;
  const buf = Buffer.concat([Buffer.from([0]), pubKeyHash]);
  const str = '16VZnHwRhwrExfeHFHGjwrgEMq8VcYPs9r';

  // Input any address here checl the address is driven form
  // the Testnet or Mainnet.
  const testAddress1 = 'mqzrmgneGvEMmPqpkB7mLWSoam73jSLeMJ';
  const testAddress2 = '146py9A7ntfLVsaPusqdkDCLHVe8pxrYqG';

  // it('should satisfy these basic API features', function () {
  //   new Address.Testnet().constructor.should.equal(
  //     new Address.Testnet().constructor
  //   );
  // });

  // Test for MAINNET address
  describe('@fromTestAddress1', function () {
    it('this address is from testnet', function () {
      const address = Address.Testnet.fromRandom();
      address.fromString(testAddress1);
      address.versionByteNum = Constants.Testnet.Address.pubKeyHash;
      address.fromString(address.toString());
      address.toString().should.equal(testAddress1);
    });
  });

  // Test for TESTNET address
  describe('@fromTestAddress2', function () {
    it('this address is from mainnet', function () {
      const address = new Address();
      address.fromString(testAddress2);
      address.fromString(address.toString());
      address.toString().should.equal(testAddress2);
    });
  });
});
