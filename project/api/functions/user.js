const { t: typy } = require("typy");
const User = require("../system/User");
const { HTTP_STATUS, Generator } = require("../constants");

async function createUser(event) {
  try {
    const body = JSON.parse(event.body);

    const user = await User.create({ ...body });
    const token = await User.login({ ...body });

    return {
      statusCode: HTTP_STATUS.CREATED,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Created & Connected",
          token: token,
          username: user.username
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
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

async function loginUser(event) {
  try {
    const body = JSON.parse(event.body);

    const token = await User.login({ ...body });

    const user = await User.get({ ...body });

    return {
      statusCode: HTTP_STATUS.OK,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Connected",
          token: token,
          username: user.username
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
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

async function getUserPlatformKey(event) {
  try {
    const params = event.queryStringParameters;

    const user = await User.validate({ ...params, source: "platform" });

    const profile = await User.get({ id: user.id, token: params.token });

    const data = await User.decodeJWTData({ ...params });

    return {
      statusCode: HTTP_STATUS.OK,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Platform Info",
          user: {
            email: profile.email,
            token: data.token
          }
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
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

async function getUser(event) {
  try {
    const params = event.queryStringParameters;

    let user = null;

    if (typy(params, "api").isTruthy) {
      console.log("Validating for library...");
      user = await User.validate({ ...params, source: "library" });
    } else {
      console.log("Validating for platform...");
      user = await User.validate({ ...params, source: "platform" });
    }

    console.log(user);

    const profile = await User.getProfile({ id: user.id, token: params.token });

    console.log(profile);

    return {
      statusCode: HTTP_STATUS.OK,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Profile",
          user: profile
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
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

module.exports.getUserPlatformKey = getUserPlatformKey;
module.exports.getUser = getUser;
module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
