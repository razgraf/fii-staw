"use strict";

const Bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { t: typy } = require("typy");
const Networking = require("./Networking");
const Fractal = require("./Fractal");
const Image = require("./Image");
const Key = require("./Key");

const { ERRORS, API } = require("./../constants");

class User {
  constructor(payload) {
    this.bind(payload);
  }

  bind({ id, uuid, username, email, password, createdAt }) {
    this.id = typy(id).safeNumber;
    this.uuid = typy(uuid).safeString;
    this.username = typy(username).safeString;
    this.email = typy(email).safeString;
    this.password = typy(password).safeString;
    this.createdAt = typy(createdAt).safeString;
  }

  static async create({ username, email, password }) {
    if (typy(username).isFalsy || typy(email).isFalsy || typy(password).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const payload = {
      username: typy(username).safeString,
      email: typy(email).safeString,
      password: typy(password).safeString
    };

    const existingWithEmail = await Networking.getUserFromDB({
      email: payload.email
    });
    const existingWithUsername = await Networking.getUserFromDB({
      username: password.username
    });

    if (existingWithEmail || existingWithUsername)
      throw new Error(ERRORS.CONFLICTING_USER);

    if (Object.keys(payload).some(key => payload[key].length < 3))
      throw new Error(ERRORS.INVALID_PARAMS);

    payload.password = await Bcrypt.hash(password, 10);

    const result = await Networking.insertUserIntoDB(payload);

    console.error(result);

    if (!result) throw new Error(ERRORS.NETWORKING);

    return new User(result);
  }

  static async login({ email, password }) {
    /**
     * Check validity of parameters
     */
    if (typy(email).isFalsy || typy(password).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const payload = {
      email: typy(email).safeString,
      password: typy(password).safeString
    };

    /**
     * Check password integrity
     */

    const result = await Networking.getUserFromDB({ email: payload.email });

    if (!result) throw new Error(ERRORS.MISSING_USER);

    const match = await Bcrypt.compare(
      payload.password,
      typy(result, "password").safeString
    );

    if (!match) throw new Error(ERRORS.MISMATCH_USER_AUTH);

    /**
     * Get user profile and create new token/key
     */

    const user = new User(result);

    const key = await Key.create({ userId: user.id, platform: 1 });

    if (!key) throw new Error(ERRORS.NETWORKING);

    /**
     * Wrap in JWT and send it back
     */

    const jToken = JWT.sign(
      {
        data: {
          userUuid: user.uuid,
          token: key.token
        }
      },
      process.env.S_JWT_SECRET,
      { expiresIn: 2 * 24 * 60 * 60 }
    );

    return jToken;
  }

  static async get({ id, uuid, email, username }) {
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

    const result = await Networking.getUserFromDB({ ...payload });

    if (!result) throw new Error(ERRORS.INVALID_CREDENTIALS);

    return new User(result);
  }

  static async getProfile({ id, token }) {
    if (typy(id).isFalsy || typy(token).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    /**
     * Retrieve user
     */

    const rawUser = await Networking.getUserFromDB({ id });

    if (!rawUser) throw new Error(ERRORS.INVALID_CREDENTIALS);

    const user = new User(rawUser);

    /**
     * Retrieve specific token
     */

    const rawKey = await Networking.getLibraryKeyFromDB({
      userId: user.id,
      token
    });

    if (!rawKey) throw new Error(ERRORS.INVALID_CREDENTIALS);

    const key = new Key(rawKey);

    /**
     * Retrieve history (last 10 actions)
     */

    const history = await Networking.getUserHistoryFromDB({ id });

    return {
      identity: {
        abstract: "Your identity inside the FrIC ecosystem.",
        username: user.username,
        email: user.email
      },
      key: {
        abstract: "Information on the key you are using right now.",
        ...key.toObject(true)
      },
      history: history.map(e => Fractal.format(e))
    };
  }

  static async validate({ source = "platform", ...payload }) {
    if (source === "platform") return User.validateForPlatform(payload);
    else return User.validateForLibrary(payload);
  }

  static async validateForPlatform({ token }) {
    if (typy(token).isFalsy) {
      console.error("Missing parameteres for token validation");
      throw new Error(ERRORS.FORBIDDEN);
    }

    const decoded = JWT.verify(token, process.env.S_JWT_SECRET);

    console.log("Decoded:", decoded);

    if (!decoded) {
      console.error("Token may have been tempered with.");
      throw new Error(ERRORS.FORBIDDEN);
    }

    const { data } = decoded;

    const match = await Networking.matchUserKeyFromDB({ ...data });

    if (!match) {
      console.error("Mismatch at user-key level.");
      throw new Error(ERRORS.FORBIDDEN);
    }

    const user = User.get({ uuid: data.userUuid });

    return user;
  }

  static async validateForLibrary({ email, token }) {
    if (typy(token).isFalsy || typy(email).isFalsy) {
      console.error("Missing parameteres for token validation");
      throw new Error(ERRORS.INVALID_PARAMS);
    }

    const data = {
      email: typy(email).safeString,
      token: typy(token).safeString
    };

    const user = await User.get({ email });

    if (!user) {
      console.error("User does not exist.");
      throw new Error(ERRORS.MISSING_USER);
    }

    console.log("User:", user);

    const result = await Networking.getLibraryKeyFromDB({
      userId: user.id,
      token: data.token
    });

    if (!result) {
      console.error("Mismatch at library user-key level.");
      throw new Error(ERRORS.INVALID_CREDENTIALS);
    }

    const key = new Key(result);

    if (key.quota <= 0) {
      console.error("Quota below 0.");
      throw new Error(ERRORS.EXPIRED_KEY);
    }

    return user;
  }

  static async spend({ userId, token }) {
    if (typy(userId).isFalsy || typy(token).isFalsy) {
      console.error("Missing parameteres for token validation");
      throw new Error(ERRORS.INVALID_PARAMS);
    }

    const key = await Networking.getLibraryKeyFromDB({
      userId,
      token
    });

    if (!key) {
      console.error("Key missing at retrieve.");
      throw new Error(ERRORS.FORBIDDEN);
    }

    const spendKey = await Networking.spendKeyQuotaIntoDB({
      id: key.id
    });

    if (!spendKey) {
      console.error("Key missing at spend.");
      throw new Error(ERRORS.NETWORKING);
    }

    return spendKey.quota;
  }
}

module.exports = User;
