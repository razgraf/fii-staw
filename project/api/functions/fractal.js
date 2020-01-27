const { t: typy } = require("typy");
const { HTTP_STATUS, ERRORS, Generator } = require("../constants");

const User = require("../system/User");
const Fractal = require("../system/Fractal");

async function createFractal(event) {
  try {
    /**
     * Authorize user based on the source of the request (platform vs library)
     */
    const location = event.queryStringParameters;
    const body = JSON.parse(event.body);

    let user = null;

    console.log(location, body);

    if (typy(location, "api").isTruthy) {
      console.log("Validating for library...");
      user = await User.validate({ ...body, source: "library" });
    } else {
      console.log("Validating for platform...");
      user = await User.validate({ ...body, source: "platform" });
    }

    console.log("User: ", user);

    const fractal = await Fractal.generate({ ...body, userId: user.id });
    console.log("Fractal:", fractal);
    const quota = await User.spend({ userId: user.id, token: body.token });
    console.log("Quota: ", quota);

    return {
      statusCode: HTTP_STATUS.CREATED,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: `Created #${fractal.name ? fractal.name : "Fractal"}`,
          url: fractal.publicUrl,
          quota
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

async function getFractalList(event) {
  try {
    const params = event.queryStringParameters;

    const user = await User.validate({ ...params });

    const fractals = await Fractal.getList({ ...params, userId: user.id });

    return {
      statusCode: HTTP_STATUS.OK,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Retrieved",
          list: fractals
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

async function publishFractal(event) {
  // access == 2 (published)
  // TODO
  try {
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

async function unpublishFractal(event) {
  // access == 1 (published)
  // TODO
  try {
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

module.exports.unpublishFractal = unpublishFractal;
module.exports.publishFractal = publishFractal;
module.exports.getFractalList = getFractalList;
module.exports.createFractal = createFractal;
