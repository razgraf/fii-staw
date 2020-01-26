"use strict";
const AWS = require("aws-sdk");
AWS.config.setPromisesDependency(require("bluebird"));

const fractalFunctions = require("./functions/fractal");
const userFunctions = require("./functions/user");
const keyFunctions = require("./functions/key");

module.exports.createFractal = fractalFunctions.createFractal;

module.exports.createUser = userFunctions.createUser;
module.exports.loginUser = userFunctions.loginUser;
module.exports.getUser = userFunctions.getUser;

module.exports.assignKey = keyFunctions.assignKey;
module.exports.listKeys = keyFunctions.listKeys;
