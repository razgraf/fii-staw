const { createCanvas } = require("canvas");
const { FRACTAL_DEFINITIONS } = require("../system/constants");
const Fractal = require("../system/fractal");

async function createFractal(event) {
  try {
    const canvas = createCanvas(800, 800);

    const definition = {
      iterations: 2,
      start: {
        symbol: "X",
        x: 400,
        y: canvas.height
      },
      rules: FRACTAL_DEFINITIONS.plant,
      angle: 25
    };

    const fractal = new Fractal(canvas);
    const isCreated = await fractal.create("lSystem", definition);
    if (!isCreated) throw new Error("Couldn't create fractal.");

    console.log("created");

    const isInDB = await fractal.saveToDatabase();
    if (!isInDB) throw new Error("Couldn't upload fractal to bucket.");

    console.log("inDatabase");

    const isInBucket = await fractal.saveToBucket();
    if (!isInBucket) throw new Error("Couldn't upload fractal to bucket.");

    console.log("inS3");

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Done",
          url: fractal.publicUrl
        },
        null,
        2
      )
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: error
        },
        null,
        2
      )
    };
  }
}

module.exports.createFractal = createFractal;
