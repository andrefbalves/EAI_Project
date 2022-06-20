import * as mysql from "mysql2/promise";

export var db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "eai_project"
});