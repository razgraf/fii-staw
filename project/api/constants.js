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

  INVALID_CREDENTIALS: "InvalidCredentialsError",

  CONFLICTING_USER: "ConflictingUserError",
  MISSING_USER: "MissingUserError",
  MISMATCH_USER_AUTH: "MismatchUserAuthError",

  EXPIRED_KEY: "ExpiredKeyError",
  MISSING_KEY: "MissingKeyError",

  MISSING_FRACTAL: "MissingFractalKey",

  INVALID_FRACTAL_DEFINITION: "InvalidFractalDefinition",

  NETWORKING: "NetworkingError"
};

const Generator = {
  headers: () => {
    return {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*"
    };
  }
};
module.exports.Generator = Generator;
module.exports.ERRORS = ERRORS;
module.exports.HTTP_STATUS = HTTP_STATUS;
module.exports.RESOURCES = RESOURCES;
module.exports.FRACTAL_DEFINITIONS = FRACTAL_DEFINITIONS;
