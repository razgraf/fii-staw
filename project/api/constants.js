"use strict";

const RESOURCES = {
  BUCKET: "serverless-s3-fii-staw-fractal-bucket",
  REGION: "eu-west-2"
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUHTORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
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

const ERRORS = {
  INVALID_PARAMS: "InvalidParamsError",

  CONFLICTING_USER: "ConflictingUserError",
  MISSING_USER: "MissingUserError",
  MISMATCH_USER_AUTH: "MismatchUserAuthError",

  NETWORKING: "NetworkingError"
};

module.exports.ERRORS = ERRORS;
module.exports.HTTP_STATUS = HTTP_STATUS;
module.exports.RESOURCES = RESOURCES;
module.exports.FRACTAL_DEFINITIONS = FRACTAL_DEFINITIONS;
