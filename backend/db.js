const Pool = require("pg").Pool;

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    user: "postgres",
    password: "Daniil200301",
    port: 5432,
    database: "node_postgres",
    host: "localhost",
});

module.exports = pool;
