const db = require("./config");

async function getClassesConfig() {
    let query = "SELECT * FROM classes_config";
    let classes = await db.execute(query);

    return classes[0];
}

async function getEngineConfig() {
    let query = "SELECT * FROM engine_config";
    let configs = await db.execute(query);

    return configs[0][0];
}

module.exports = {getClassesConfig, getEngineConfig};