"use strict";

const { createCanvas } = require("canvas");
const { FRACTAL_DEFINITIONS } = require("./system/constants");
const Fractal = require("./system/fractal");
const Image = require("./system/image");

module.exports.generate = async event => {
  const canvas = createCanvas(800, 800);

  const lSystem = new Fractal(canvas);
  lSystem.create("lSystem", {
    iterations: 2,
    start: {
      symbol: "X",
      x: 400,
      y: canvas.height
    },
    rules: FRACTAL_DEFINITIONS.plant,
    angle: 25
  });

  const url = await Image.saveToBucket(lSystem.extract());

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hey.",
        url: url
      },
      null,
      2
    )
  };
};
