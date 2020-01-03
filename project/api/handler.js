"use strict";

const { createCanvas } = require("canvas");
const { Fractal, DEFINITIONS } = require("./element/fractal");

module.exports.hello = async event => {
  const canvas = createCanvas(800, 800);

  const lSystem = new Fractal(canvas);
  lSystem.create("lSystem", {
    iterations: 3,
    start: {
      symbol: "X",
      x: 400,
      y: canvas.height
    },
    rules: DEFINITIONS.plant,
    angle: 25
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        image: lSystem.extract()
      },
      null,
      2
    )
  };
};
