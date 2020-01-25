"use strict";

const Bcrypt = require("bcryptjs");
const { t: typy } = require("typy");
const Networking = require("./Networking");

const { ERRORS } = require("./../constants");

class User {
  constructor(payload) {
    this.bind(payload);
  }

  bind({ id, uuid, username, email, password, createdAt }) {
    this.id = typy(id).safeString;
    this.uuid = typy(uuid).safeString;
    this.username = typy(username).safeString;
    this.email = typy(email).safeString;
    this.password = typy(password).safeString;
    this.createdAt = typy(createdAt).safeString;
  }

  static async create({ username, email, password }) {
    if (
      typy(username).isFalsy ||
      typy(email).isFalsy ||
      typy(password).isFalsy
    ) {
      console.error(ERRORS.INVALID_PARAMS);
      throw new Error(ERRORS.INVALID_PARAMS);
    }

    const payload = {
      username: typy(username).safeString,
      email: typy(email).safeString,
      password: typy(password).safeString
    };

    if (Object.keys(payload).some(key => payload[key].length < 3)) {
      console.error(ERRORS.INVALID_PARAMS);
      throw new Error(ERRORS.INVALID_PARAMS);
    }

    payload.password = await Bcrypt.hash(password, 5);

    const result = await Networking.insertUserIntoDB(payload);

    console.log(result);

    if (!result) throw new Error(ERRORS.NETWORKING);

    return new User(result);
  }

  get({ id, uuid, email, username }) {
    if (
      typy(id).isFalsy &&
      typy(uuid).isFalsy &&
      typy(email).isFalsy &&
      typy(username).isFalsy
    )
      throw new Error(ERRORS.INVALID_PARAMS);

    const payload = {
      id: typy(id).safeNumber,
      uuid: typy(uuid).safeString,
      email: typy(email).safeString,
      username: typy(username).safeString
    };

    const result = Networking.getUserFromDB(payload);

    if (!result) throw new Error(ERRORS.MISSING_USER);

    return new User(result);
  }

  static async login({ email, password }) {
    if (typy(email).isFalsy || typy(password).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const payload = {
      email: typy(email).safeString,
      password: typy(password).safeString
    };

    const result = Networking.getUserFromDB({ email: payload.email });

    if (!result) throw new Error(ERRORS.MISSING_USER);

    const match = await Bcrypt.compare(
      payload.password,
      typy(result, "password").safeString
    );

    if (!match) throw new Error(ERRORS.MISMATCH_USER_AUTH);

    return new User(result);
  }
}

module.exports = User;
