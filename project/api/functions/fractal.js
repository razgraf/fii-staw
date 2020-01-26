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

    console.log(user);

    const fractal = await Fractal.generate({ ...body, userId: user.id });
    const quota = await User.spend({ userId: user.id, token: body.token });

    return {
      statusCode: HTTP_STATUS.CREATED,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Done",
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

module.exports.createFractal = createFractal;
