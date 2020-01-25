"use strict";

const Image = require("./Image");
const Networking = require("./Networking");
/**
 * @typedef {Object} Definition - Parameters that will describe rules and attributes for the soon-to-be generated
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
    this.id = null;
    this.createdAt = null;
  }

  extract() {
    return this.canvas.toDataURL();
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
    const inserted = await Networking.insertFractalIntoDB({
      definition: JSON.stringify(this.definition)
    });

    console.log(inserted);

    if (inserted !== null) {
      this.id = inserted.id;
      this.uuid = inserted.uuid;
      this.createdAt = inserted.createdAt;
      this.name = inserted.name;
      return true;
    } else {
      this.id = null;
      this.uuid = null;
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
      structure = this.generate(structure, rules);
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

  generate(structure, rules) {
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
}

module.exports = Fractal;
