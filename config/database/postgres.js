const { Pool } = require("pg"),
  config = require("../").ps_database;
const pool = new Pool({
  host: config.database_host,
  port: config.database_port,
  database: config.database_schema,
  user: config.database_username,
  password: config.database_password,
});

module.exports = pool;
 