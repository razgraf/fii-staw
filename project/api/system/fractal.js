"use strict";
const {
  FRACTAL_DEFINITIONS,
  HTTP_STATUS,
  ERRORS,
  Generator
} = require("../constants");

const Bcrypt = require("bcryptjs");

const { createCanvas } = require("canvas");
const { t: typy } = require("typy");
const stringify = require("json-stable-stringify");
const Image = require("./Image");
const Networking = require("./Networking");
/**
 * @typedef {Object} Definition - Parameters that will describe rules and attributes for the soon-to-be computed
 * @property {number} iterations - e.g. 3
 * @property {Object} start
 * @property {string} start.symbol - start symbol for the grammar e.g. "X"
 * @property {int} start.x - cartesian coordinate in OX for start point e.g. 100
 * @property {int} start.y - cartesian coordinate in OY for start point e.g. 100
 * @property {Array<Object>} rules - e.g. [{left : "X", right : "X+YF+"}]
 * @property {number} angle - e.g. 360
 */

class Fractal {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.definition = null;
    this.publicUrl = null;
    this.type = null;
    this.uuid = null;
    this.reference = null;
    this.id = null;
    this.createdAt = null;
    this.userId = null;
    this.username = null;
    this.access = null;
  }

  extract() {
    return this.canvas.toDataURL();
  }

  static format(e) {
    let definition = e.definition;
    let image = Image.getPublicUrlFromS3(e.uuid) + ".png";
    try {
      definition = JSON.parse(definition);
      if (typy(e, "reference").isTruthy)
        image = Image.getPublicUrlFromS3(e.reference) + ".png";
    } catch (e) {}

    return {
      image,
      self: e.self,
      access: e.access,
      abstract: "Generated fractal.",
      identifier: e.uuid,
      reference: e.reference,
      name: e.name,
      definition: definition,
      hash: e.hash,
      votes: e.votes,
      timestamp: e.createdAt,
      username: e.username
    };
  }

  static async getList({ userId, limit = 20, offset = 0 }) {
    if (typy(userId).isFalsy) throw new Error(ERRORS.INVALID_PARAMS);

    const payload = {
      userId,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const list = await Networking.getFractalListFromDB(payload);

    if (!list || list.length === 0) return [];

    return list.map(e => Fractal.format({ ...e, self: e.userId === userId }));
  }

  static async setPublish({ uuid, userId, access = 1 }) {
    if (typy(userId).isFalsy || typy(uuid).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const fractal = await Networking.getFractalFromDB({ uuid });
    console.log(fractal);
    if (!fractal) throw new Error(ERRORS.MISSING_FRACTAL);

    const published =
      access === 2
        ? await Networking.setFractalPublishIntoDB({ id: fractal.id })
        : await Networking.setFractalUnpublishIntoDB({ id: fractal.id });

    console.log(published);

    if (!published) throw new Error(ERRORS.NETWORKING);

    return Fractal.format(published);
  }

  static async publish({ uuid, userId }) {
    if (typy(userId).isFalsy || typy(uuid).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const reference = await Networking.getFractalFromDB({ uuid });
    console.log(reference);

    if (!reference) throw new Error(ERRORS.MISSING_FRACTAL);

    const fractal = await Networking.insertFractalIntoDB({
      ...reference,
      reference: uuid,
      userId
    });
    console.log(fractal);
    if (!fractal) throw new Error(ERRORS.NETWORKING);

    const published = await Fractal.setPublish({ uuid, userId, access: 2 });
    console.log(published);

    if (!published) throw new Error(ERRORS.NETWORKING);

    const result = Networking.getFractalFromDB({ uuid: fractal.uuid });

    return Fractal.format(result);
  }

  static async generate({ definition, userId, name = "Fractal" }) {
    if (
      typy(definition).isFalsy ||
      typy(definition, "iterations").isFalsy ||
      typy(definition, "start").isFalsy ||
      typy(definition, "start.symbol").isFalsy ||
      typy(definition, "start.x").isFalsy ||
      typy(definition, "start.y").isFalsy ||
      typy(definition, "rules").isFalsy ||
      typy(definition, "angle").isFalsy
    )
      throw new Error(ERRORS.INVALID_FRACTAL_DEFINITION);

    try {
      const height = typy(definition, "height").isTruthy
        ? parseInt(definition["height"])
        : 800;
      const width = typy(definition, "width").isTruthy
        ? parseInt(definition["width"])
        : 800;

      const canvas = createCanvas(width, height);

      const rules = typy(definition, "rules").safeArray;

      const parsedDefinition = {
        iterations: parseInt(definition.iterations),
        start: {
          symbol: String(definition.start.symbol),
          x: parseInt(definition.start.x),
          y: parseInt(definition.start.y)
        },
        rules,
        angle: parseInt(definition.angle)
      };

      console.log(parsedDefinition);

      const fractal = new Fractal(canvas);
      fractal.userId = userId;
      fractal.name = name;

      /********** IMPORTANT BREAKING CHANGE (lSystemRec) ************/

      // const isCreated = await fractal.create("lSystem", parsedDefinition);
      const isCreated = await fractal.create("lSystemRec", parsedDefinition);

      if (!isCreated) throw new Error("Couldn't create fractal.");

      console.log("created");

      const isInDB = await fractal.saveToDatabase();
      if (!isInDB) throw new Error("Couldn't upload fractal to bucket.");

      console.log("inDatabase");

      const isInBucket = await fractal.saveToBucket();
      if (!isInBucket) throw new Error("Couldn't upload fractal to bucket.");

      console.log("inS3");

      return fractal;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {string} type
   * @param {Definition} definition
   */
  async create(type, definition) {
    this.type = type;
    this.definition = definition;

    switch (type) {
      case "lSystem":
        this.create_lSystem(definition);
        break;
      case "lSystemRec":
        this.create_lSystemRec(
          definition.iterations,
          definition.start.symbol,
          definition.rules,
          { x: definition.start.x, y: definition.start.y, degrees: 270 },
          definition.angle,
          [],
          8
        );
        break;
      default:
        console.eror('Unknown type. Expected one of ["lSystem"]');
        return false;
    }

    return true;
  }

  async saveToBucket() {
    if (!this.uuid) {
      console.warn("Missing data. Cannot save to bucket without active uuid.");
      return false;
    }

    const base64Image = this.extract();

    if (!base64Image) {
      console.warn("Missing data. Nothing to save into the bucket.");
      return false;
    }

    this.publicUrl = await Image.saveToBucket({
      key: `${this.uuid}.png`,
      data: base64Image
    });

    return true;
  }

  async saveToDatabase() {
    const rules = this.definition.rules;
    rules.sort((a, b) => {
      return a.left < b.left;
    });

    const hashed = await Bcrypt.hash(
      stringify({
        ...this.definition,
        rules
      }),
      1
    );

    const inserted = await Networking.insertFractalIntoDB({
      name: this.name,
      definition: JSON.stringify(this.definition),
      userId: this.userId,
      hash: hashed
    });

    console.log(inserted);

    if (inserted !== null) {
      this.id = inserted.id;
      this.uuid = inserted.uuid;
      this.reference = inserted.reference;
      this.createdAt = inserted.createdAt;
      this.name = inserted.name;
      return true;
    } else {
      this.id = null;
      this.uuid = null;
      this.reference = null;
      this.createdAt = null;
      this.name = null;
      return false;
    }
  }

  /**
   * @param {Definition} definition
   */

  create_lSystem(definition) {
    const { iterations, start, rules, angle } = definition;

    if (!this.context)
      throw new Error("The canvas context is missing or undefined.");

    let structure = start.symbol;

    let length = 256;
    let degrees = 270;
    let states = [];

    let from = { ...start };
    let to = {
      x: 0,
      y: 0
    };

    for (let i = 0; i < iterations; ++i) {
      structure = this.compute(structure, rules);
      length /= 2;
    }

    this.context.moveTo(from.x, from.y);

    for (let symbol of structure) {
      switch (symbol) {
        case "F": {
          to.x = from.x + length * Math.cos((degrees * Math.PI) / 180);
          to.y = from.y + length * Math.sin((degrees * Math.PI) / 180);
          this.context.lineTo(to.x, to.y);
          this.context.stroke();
          from.x = to.x;
          from.y = to.y;
          this.context.moveTo(from.x, from.y);
          break;
        }
        case "+": {
          degrees += angle;
          break;
        }
        case "-": {
          degrees -= angle;
          break;
        }
        case "[": {
          states.push({ x: from.x, y: from.y, degrees });
          break;
        }
        case "]": {
          const state = states.pop();
          from.x = state.x;
          from.y = state.y;
          degrees = state.degrees;
          this.context.moveTo(from.x, from.y);
          break;
        }
        default:
          break;
      }
    }
  }

  /**
   *
   * @param {string} structure  - e.g. "F+[[X]-X]-F[-FX]+X"
   * @param {Array<Object>} rules  - e.g. [{left : "X", right : "X+YF+"}]
   */

  compute(structure, rules) {
    var final = "";
    var found = 0;
    for (let symbol of structure) {
      found = 0;
      for (let i = 0; i < rules.length; ++i) {
        if (rules[i].left === symbol) {
          final += rules[i].right;
          found = 1;
          break;
        }
      }
      if (found === 0) {
        final += symbol;
      }
    }
    return final;
  }

  /**
   *
   * REC SYS
   *
   *
   */

  create_lSystemRec(iterations, start, rules, state, angle, states, len) {
    if (!this.context)
      throw new Error("The canvas context is missing or undefined.");

    for (let s of start) {
      if ("A" <= s && s <= "Z") {
        let found = 0;
        if (iterations > 0) {
          for (let rule of rules) {
            if (rule.left == s) {
              found = 1;
              this.create_lSystemRec(
                iterations - 1,
                rule.right,
                rules,
                state,
                angle,
                states,
                len
              );
              break;
            }
          }
        } else {
          //mystring += s;
        }
        if (s == "F" && (found == 0 || iterations == 0)) {
          this.context.beginPath();
          this.context.moveTo(state.x, state.y);
          let xf = state.x + len * Math.cos((state.degrees * Math.PI) / 180);
          let yf = state.y + len * Math.sin((state.degrees * Math.PI) / 180);
          this.context.lineTo(xf, yf);
          this.context.stroke();
          state.x = xf;
          state.y = yf;
          this.context.moveTo(state.x, state.y);
        }
      } else if (s == "+") {
        //mystring += s;
        state.degrees += angle;
      } else if (s == "-") {
        //mystring += s;
        state.degrees -= angle;
      } else if (s == "[") {
        //mystring += s;
        states.push({ ...state });
      } else if (s == "]") {
        //mystring += s;
        state = states.pop();
        this.context.moveTo(state.x, state.y);
      }
    }
  }

  preprocessRules(start, rules) {
    let to = "a";
    let coada = [];
    let used = new Set();
    for (let i = 0; i < start.length; i++) {
      if ("A" <= start[i] && start[i] <= "Z") {
        if (!used.has(start[i])) {
          coada.push(start[i]);
          used.add(start[i]);
        }

        while (coada.length > 0) {
          let from = coada.pop();
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].left == from) {
              rules[j].left = to;
              for (let k = 0; k < rules[j].right.length; k++) {
                if ("A" <= rules[j].right[k] && rules[j].right[k] <= "Z") {
                  if (!used.has(rules[j].right[k])) {
                    coada.push(rules[j].right[k]);
                    used.add(rules[j].right[k]);
                  }
                }
              }
            }
            if (from != "F") {
              rules[j].right = rules[j].right.replace(from, to);
              start = start.replace(from, to);
            }
          }
          to = String.fromCharCode(to.charCodeAt() + 1);
          if (to == "f") String.fromCharCode(to.charCodeAt() + 1);
        }
      }
    }
    rules.sort((a, b) => {
      return a.left < b.left;
    });

    start = start.toUpperCase();
    for (let i = 0; i < rules.length; i++) {
      rules[i].left = rules[i].left.toUpperCase();
      rules[i].right = rules[i].right.toUpperCase();
    }

    return start;
  }
}

module.exports = Fractal;
