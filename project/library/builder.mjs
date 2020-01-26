/**
 * @typedef {Object} Auth
 * @property {string} email - The unique user email
 * @property {token} token - The value which will determine the quota of a user
 */

/**
 * @typedef {Object} Identity
 * @property {string} name - The unique user identification string
 * @property {Object[]} history - A brief history of the recent usage of the token
 * @property {string} history[].timestamp - Time of creation for history item
 * @property {string} history[].action - Type of history item
 * @property {string} history[].payload - Extra data that can describe the action
 * @property {Object} quota - The remaining usage quota for that particular token
 * @property {string} quota.quantity - Remaining horse power
 * @property {string} quota.refresh - Timestamp for next quota refresh (if any)
 */

const API = {
  ROOT: "https://s7ee0vf99b.execute-api.eu-west-2.amazonaws.com/dev",
  WHO: () => `${API.ROOT}/user`,
  GENERATE: () => `${API.ROOT}/fractal?api=true`
};

class FractalBuilder {
  get email() {
    return this._email;
  }
  set email(email) {
    this._email = email;
  }

  get token() {
    return this._token;
  }
  set token(token) {
    this._token = token;
  }

  constructor(auth) {
    if (!FractalBuilder.isAuthObjectValid(auth)) return;
    const { email, token } = auth;
    this.email = email;
    this.token = token;
  }

  /**
   *
   * @param {Auth} auth
   */
  static init(auth) {
    if (!FractalBuilder.isAuthObjectValid(auth)) return {};
    return new FractalBuilder(auth);
  }

  async who() {
    console.log(API);
    return "You";
  }

  static validateDefinitionAttribute(
    definition,
    attribute,
    errorInfo = null,
    type = null
  ) {
    if (!definition || !attribute)
      throw new Error("Null definition and attributes.");
    if (
      !(String(attribute) in definition) ||
      definition[attribute] === null ||
      definition[attribute] === undefined
    )
      throw new Error(
        `Missing '${String(attribute)}'${
          errorInfo ? " " + String(errorInfo) : ""
        }.`
      );
    if (type && typeof definition[attribute] !== type)
      throw new Error(
        `Definition attribute '${String(attribute)}' is of wrong type${String(
          attribute
        )}'${errorInfo ? " " + String(errorInfo) : ""}.`
      );
  }

  async build(definition) {
    if (
      !FractalBuilder.isAuthObjectValid({
        email: this.email,
        token: this.token
      })
    ) {
      console.error("FractalBuilder > ", "Interrupting build.");
      return null;
    }

    try {
      FractalBuilder.validateDefinitionAttribute(
        definition,
        "height",
        "(number)"
      );
      FractalBuilder.validateDefinitionAttribute(
        definition,
        "width",
        "(number)"
      );
      FractalBuilder.validateDefinitionAttribute(
        definition,
        "iterations",
        "(number)"
      );
      FractalBuilder.validateDefinitionAttribute(
        definition,
        "angle",
        "(number)"
      );
      FractalBuilder.validateDefinitionAttribute(
        definition,
        "start",
        "(object with 'symbol', 'x' and 'y')",
        "object"
      );
      FractalBuilder.validateDefinitionAttribute(
        definition.start,
        "symbol",
        "(string)",
        "string"
      );
      FractalBuilder.validateDefinitionAttribute(
        definition.start,
        "x",
        "(number - coordinate)",
        "number"
      );
      if (definition.start.x < 0 || definition.start.x > definition.width)
        throw new Error("Definitions.start.x is outside of the map.");
      FractalBuilder.validateDefinitionAttribute(
        definition.start,
        "y",
        "(number - coordinate)",
        "number"
      );
      if (definition.start.y < 0 || definition.start.y > definition.height)
        throw new Error("Definitions.start.y is outside of the map.");

      FractalBuilder.validateDefinitionAttribute(
        definition,
        "rules",
        "(array)"
      );

      definition.rules.forEach((rule, index) => {
        FractalBuilder.validateDefinitionAttribute(
          rule,
          "left",
          `in rules (string, in rule #${index + 1})`,
          "string"
        );
        FractalBuilder.validateDefinitionAttribute(
          rule,
          "right",
          `in rules (string, in rule #${index + 1})`,
          "string"
        );
      });
    } catch (e) {
      console.error("FractalBuilder > Invalid Definition > ", e);
      return null;
    }

    const endpoint = new URL(API.GENERATE());

    const body = {
      email: this.email,
      token: this.token,
      definition
    };

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body)
    });

    console.log("Resilt: ", response);

    try {
      switch (response.status) {
        case 201: {
          const result = await response.json();
          console.log("Result:", result);
          break;
        }
        case 400: {
          const result = await response.json();
          throw new Error(result.message);
        }
        case 403: {
          throw new Error(
            "The credentials you entered are invalid. Please provide valid authentication data."
          );
        }
        default: {
          throw new Error("");
        }
      }
    } catch (e) {
      console.error("FractalBuilder > ", e);
    }

    return null;
  }

  static isAuthObjectValid(auth) {
    const { email, token } = auth;

    try {
      if (!email || !token) {
        console.error("FractalBuilder > ", "Missing authenthiction data.");
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  }
}

export default FractalBuilder;
