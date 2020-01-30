"use strict";
const AWS = require("aws-sdk");
AWS.config.setPromisesDependency(require("bluebird"));

const fractalFunctions = require("./functions/fractal");
const userFunctions = require("./functions/user");
const keyFunctions = require("./functions/key");

module.exports.createFractal = fractalFunctions.createFractal;
module.exports.setFractalPublic = fractalFunctions.setFractalPublic;
module.exports.setFractalPrivate = fractalFunctions.setFractalPrivate;
module.exports.publishFractal = fractalFunctions.publishFractal;
module.exports.getFractalList = fractalFunctions.getFractalList;
module.exports.voteFractal = fractalFunctions.voteFractal;

module.exports.createUser = userFunctions.createUser;
module.exports.loginUser = userFunctions.loginUser;
module.exports.getUser = userFunctions.getUser;
module.exports.getUserPlatformKey = userFunctions.getUserPlatformKey;

module.exports.assignKey = keyFunctions.assignKey;
module.exports.listKeys = keyFunctions.listKeys;
