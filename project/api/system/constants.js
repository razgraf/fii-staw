"use strict";

const RESOURCES = {
  BUCKET: "serverless-s3-fii-staw-fractal-bucket",
  REGION: "eu-west-2"
};

const FRACTAL_DEFINITIONS = {
  koch: [
    {
      left: "F",
      right: "F+F-F-F+F"
    }
  ],
  dragon: [
    {
      left: "X",
      right: "X+YF+"
    },
    {
      left: "Y",
      right: "-FX-Y"
    }
  ],

  plant: [
    {
      left: "X",
      right: "F+[[X]-X]-F[-FX]+X"
    },
    {
      left: "F",
      right: "FF"
    }
  ]
};

module.exports.RESOURCES = RESOURCES;
module.exports.FRACTAL_DEFINITIONS = FRACTAL_DEFINITIONS;
