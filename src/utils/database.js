const { Sequelize } = require("sequelize");
require('dotenv').config()

const db = new Sequelize({
  database: "railway",
  host: "containers-us-west-119.railway.app",
  port: 7667,
  username: "postgres",
  password: "EVjEz50iv3gRW4r7u8FK",
  dialect: "postgres",
  logging: false,
});

module.exports = db;
