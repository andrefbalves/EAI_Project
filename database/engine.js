const db = require("./config");

async function getClassesConfig() {
    let query = "SELECT * FROM classes_config";
    let classes = await db.execute(query);

    return classes[0];
}

async function getTrainConfig() {
    let query = "SELECT * FROM train_config";
    let configs = await db.execute(query);

    return configs[0];
}

module.exports = {getClassesConfig, getTrainConfig};