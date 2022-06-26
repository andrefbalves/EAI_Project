const db = require("./config");

async function getClassesConfig() {
    let query = "SELECT * FROM classes_config";
    let classes = await db.execute(query);

    return classes[0];
}

module.exports = {getClassesConfig};