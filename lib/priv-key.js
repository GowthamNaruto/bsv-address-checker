/**
 * Private Key
 * ===========
 *
 * A private key is used for signing transactions (or messages). The primary
 * way to use this is new PrivKey().fromRandom(), or new PrivKey().fromBuffer(buf).
 */
'use strict';

import { Bn } from './bn.js';
import { Point } from './point.js';
import { Constants } from './constants.js';
import { Base58Check } from './base-58-check.js';
import { Random } from './random.js';
import { Struct } from './struct.js';

class PrivKey extends Struct {
  constructor(bn, compressed, constants = null) {
    super({ bn, compressed });
    constants = constants || Constants.Default.PrivKey;
    this.Constants = constants;
  }

  fromJSON(json) {
    this.fromHex(json);
    return this;
  }

  toJSON() {
    return this.toHex();
  }

  fromRandom() {
    let privBuf, bn, condition;

    do {
      privBuf = Random.getRandomBuffer(32);
      bn = new Bn().fromBuffer(privBuf);
      condition = bn.lt(Point.getN());
    } while (!condition);

    this.fromObject({
      bn: bn,
      compressed: true,
    });
    return this;
  }

  static fromRandom() {
    return new this().fromRandom();
  }

  toBuffer() {
    let compressed = this.compressed;

    if (compressed === undefined) {
      compressed = true;
    }

    const privBuf = this.bn.toBuffer({ size: 32 });
    let buf;
    if (compressed) {
      buf = Buffer.concat([
        Buffer.from([this.Constants.versionByteNum]),
        privBuf,
        Buffer.from([0x01]),
      ]);
    } else {
      buf = Buffer.concat([
        Buffer.from([this.Constants.versionByteNum]),
        privBuf,
      ]);
    }

    return buf;
  }

  fromBuffer(buf) {
    if (buf.length === 1 + 32 + 1 && buf[1 + 32 + 1 - 1] === 1) {
      this.compressed = true;
    } else if (buf.length === 1 + 32) {
      this.compressed = false;
    } else {
      throw new Error(
        'Length of privKey buffer must be 33 (uncompressed pubKey) or 34 (compressed pubKey)'
      );
    }

    if (buf[0] !== this.Constants.versionByteNum) {
      throw new Error('Invalid versionByteNum byte');
    }

    return this.fromBn(new Bn().fromBuffer(buf.slice(1, 1 + 32)));
  }

  toBn() {
    return this.bn;
  }

  fromBn(bn) {
    this.bn = bn;
    return this;
  }

  static fromBn(bn) {
    return new this().fromBn(bn);
  }

  validate() {
    if (!this.bn.lt(Point.getN())) {
      throw new Error('Number must be less than N');
    }
    if (typeof this.compressed !== 'boolean') {
      throw new Error(
        'Must specify whether the corresponding public key is compressed or not (true or false)'
      );
    }
    return this;
  }

  /**
   * Output the private key a Wallet Import Format (Wif) string.
   */
  toWif() {
    return Base58Check.encode(this.toBuffer());
  }

  /**
   * Input the private key from a Wallet Import Format (Wif) string.
   */
  fromWif(str) {
    return this.fromBuffer(Base58Check.decode(str));
  }

  static fromWif(str) {
    return new this().fromWif(str);
  }

  toString() {
    return this.toWif();
  }

  fromString(str) {
    return this.fromWif(str);
  }
}

PrivKey.Mainnet = class extends PrivKey {
  constructor(bn, compressed) {
    super(bn, compressed, Constants.Mainnet.PrivKey);
  }
};

PrivKey.Testnet = class extends PrivKey {
  constructor(bn, compressed) {
    super(bn, compressed, Constants.Testnet.PrivKey);
  }
};

export { PrivKey };
