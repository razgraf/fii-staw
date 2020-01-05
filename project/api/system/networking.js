const Sequelize = require("sequelize");
class Networking {
  static initialize() {
    return new Sequelize(
      process.env.S_AWS_RDS_FRACTAL_DATABASE,
      process.env.S_AWS_RDS_FRACTAL_USERNAME,
      process.env.S_AWS_RDS_FRACTAL_PASSWORD,
      {
        host: process.env.S_AWS_RDS_FRACTAL_HOST,
        dialect: "mysql",
        port: process.env.S_AWS_RDS_FRACTAL_PORT,
        charset: "latin1",
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );
  }

  static initializeRaw() {
    return new Sequelize("fiistawdb", "developer", "cyPCBdrMT4bBW7X", {
      host: "fiistawdb.cgax6zdfpppm.eu-west-2.rds.amazonaws.com",
      dialect: "mysql",
      port: "3306",
      charset: "latin1",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  static async getFractalFromDB({ id, uuid }) {
    const DB = Networking.initialize();

    if (id) {
      const list = await DB.query(`SELECT * FROM fractal WHERE id = :id`, {
        replacements: { id: id },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    if (uuid) {
      const list = await DB.query(`SELECT * FROM fractal WHERE uuid = :uuid`, {
        replacements: { uuid: uuid },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    console.warn("Missing data. Cannot find fractal without identifiers.");

    return null;
  }

  static async insertFractalIntoDB({ name = "Fractal", definition }) {
    const DB = Networking.initializeRaw();

    const response = await DB.query(
      `
        INSERT INTO fractal
        SET
        uuid = UUID(),
        name = :name,
        definition = :definition
    `,
      {
        replacements: { name: name, definition: definition },
        type: Sequelize.QueryTypes.INSERT
      }
    );

    console.log(response);

    if (!response) return null;

    return await Networking.getFractalFromDB({ id: response[0] });
  }
}

module.exports = Networking;
