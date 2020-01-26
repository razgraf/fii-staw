"use strict";

const KeyGenerator = require("uuid-apikey");
const { t: typy } = require("typy");

const Networking = require("./Networking");
const { ERRORS } = require("./../constants");

class Key {
  constructor(payload) {
    this.bind(payload);
  }

  bind({ id, token, userId, quota, createdAt }) {
    this.id = typy(id).safeNumber;
    this.token = typy(token).safeString;
    this.userId = typy(userId).safeNumber;
    this.quota = typy(quota).safeNumber;
    this.createdAt = String(createdAt);
  }

  toObject(clean = true) {
    const result = {};
    result.token = typy(this.token).safeString;
    result.quota = typy(this.quota).safeNumber;
    result.createdAt = typy(this.createdAt).safeString;

    if (!clean) {
      result.id = typy(this.id).safeNumber;
      result.userId = typy(this.userId).safeNumber;
    }
    return result;
  }

  static async create({ userId, userUuid, platform = 0 }) {
    if (typy(userId).isFalsy && typy(userUuid).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const user = await Networking.getUserFromDB({ id: userId, uuid: userUuid });
    if (!user) throw new Error(ERRORS.MISSING_USER);

    const token = await KeyGenerator.create().apiKey;
    const key = await Networking.insertKeyIntoDB({
      userId: user.id,
      token,
      platform
    });

    if (!key) throw new Error(ERRORS.NETWORKING);

    return new Key(key);
  }

  static async get({ id }) {
    if (typy(id).isFalsy) throw new Error(ERRORS.INVALID_PARAMS);

    const key = await Networking.getKeyFromDB({ id });
    if (!key) throw new Error(ERRORS.MISSING_KEY);

    return new Key(key);
  }

  static async getList({ userId, userUuid }) {
    if (typy(userId).isFalsy && typy(userUuid).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const payload = {
      id: typy(userId).safeNumber,
      uuid: typy(userUuid).safeString
    };

    const user = await Networking.getUserFromDB({ ...payload });
    if (!user) throw new Error(ERRORS.MISSING_USER);

    const list = await Networking.getKeyListFromDB({ userId: user.id });

    if (!list || list.length === 0) return [];

    return list.map(e => new Key(e));
  }
}

module.exports = Key;
