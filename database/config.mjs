const mysql = require('mysql2/promise');

export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "eai_project"
});