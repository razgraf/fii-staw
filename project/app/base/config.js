export const RELEASE = false;
export const ROOT = "http://localhost:8888/fii-realhome/realhome/";

export const ROOT_API =
  "https://s7ee0vf99b.execute-api.eu-west-2.amazonaws.com/dev";

export const API = {
  LOGIN: `${ROOT_API}/user/login`,
  REGISTER: `${ROOT_API}/user`,
  LIST_KEYS: `${ROOT_API}/user/keys`,
  ASSIGN_KEY: `${ROOT_API}/user/key`,
  LIST_FRACTALS: `${ROOT_API}/fractal/list`,
  GENERATE_FRACTAL: `${ROOT_API}/fractal`
};

export const STORE_KEYS = {
  TOKEN: "FrICToken",
  USERNAME: "FrICUsername",
  UUID: "FrICUUID"
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

export const ERRORS = {
  INVALID_PARAMS: "InvalidParamsError",

  CONFLICTING_USER: "ConflictingUserError",
  MISSING_USER: "MissingUserError",
  MISMATCH_USER_AUTH: "MismatchUserAuthError",

  MISSING_KEY: "MissingKey",

  NETWORKING: "NetworkingError"
};
