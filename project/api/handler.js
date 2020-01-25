"use strict";

const fractalFunctions = require("./functions/fractal");
const userFunctions = require("./functions/user");
const keyFunctions = require("./functions/key");

module.exports.createFractal = fractalFunctions.createFractal;
module.exports.createUser = userFunctions.createUser;
module.exports.loginUser = userFunctions.loginUser;
module.exports.createKey = keyFunctions.createKey;
