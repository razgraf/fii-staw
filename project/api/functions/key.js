const Key = require("../system/Key");
const User = require("../system/User");

const { ERRORS, HTTP_STATUS, Generator } = require("../constants");

async function assignKey(event) {
  try {
    const body = JSON.parse(event.body);

    console.log("Request body:", body);

    const user = await User.validate({ ...body });

    console.log("User: ", user);

    const key = await Key.create({
      userId: user.id,
      userUuid: user.uuid,
      platform: 0
    });

    return {
      statusCode: HTTP_STATUS.CREATED,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Created",
          key: key.toObject()
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode:
        e.message === ERRORS.INVALID_CREDENTIALS
          ? HTTP_STATUS.FORBIDDEN
          : HTTP_STATUS.BAD_REQUEST,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: e.message
        },
        null,
        2
      )
    };
  }
}

async function listKeys(event) {
  try {
    const params = event.queryStringParameters;

    console.log("Request body:", params);

    const user = await User.validate({ ...params });

    console.log("User: ", user);

    const keys = await Key.getList({ userId: user.id, userUuid: user.uuid });

    return {
      statusCode: HTTP_STATUS.OK,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Retrieved",
          keys: keys.map(e => e.toObject())
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode:
        e.message === ERRORS.INVALID_CREDENTIALS
          ? HTTP_STATUS.FORBIDDEN
          : HTTP_STATUS.BAD_REQUEST,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: e.message
        },
        null,
        2
      )
    };
  }
}

module.exports.assignKey = assignKey;
module.exports.listKeys = listKeys;
