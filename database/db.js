const { Pool } = require("pg");
require("dotenv").config();

if (process.env.NODE_ENV == "development") {
    const pool = new Pool({
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false,
        }
    });

    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params);
                // console.log("executed query", { text });
                return res;
            } catch (error) {
                // console.error("error in query", { text });
                throw error;
            }
        }
    }
} else {
    const pool = new Pool({
        connectionString: process.env.DB_URL
    });

    module.exports = pool;
}