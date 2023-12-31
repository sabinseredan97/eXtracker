"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
//const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js");
const db = {};

/* let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else { */
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
//}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("./users")(sequelize, DataTypes);
db.emailVerifyTkn = require("./emailVerifyTkn")(sequelize, DataTypes);
db.resetPwdTkn = require("./resetPwdTkn")(sequelize, DataTypes);
db.categories = require("./categories")(sequelize, DataTypes);
db.products = require("./products")(sequelize, DataTypes);

db.users.hasOne(db.emailVerifyTkn, {
  foreignKey: "userId",
});
db.emailVerifyTkn.belongsTo(db.users);

db.users.hasOne(db.resetPwdTkn, {
  foreignKey: "userId",
});
db.resetPwdTkn.belongsTo(db.users);

db.users.hasMany(db.products, {
  foreignKey: "userId",
});
db.products.belongsTo(db.users);

db.categories.hasMany(db.products, {
  foreignKey: "categoryId",
});
db.products.belongsTo(db.categories);

//await db.emailVerifyTkn.sync({ alter: true });

module.exports = db;
