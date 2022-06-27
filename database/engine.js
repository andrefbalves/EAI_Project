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

async function saveClassesConfig(activesClasses) {
    let query = "UPDATE classes_config SET active = 0";
    await db.execute(query);
    let classes = "'" + activesClasses.join([separator = "','"]) + "'";
    query = "UPDATE classes_config SET active = 1 WHERE genre in (" + classes + ")";
    await db.execute(query);
    return true;
}

async function saveTrainConfig(limit, field, orderBy) {
    let query = "UPDATE engine_config SET train_limit_of_records = " + limit + ", train_order_by_field = '" + field + "', train_order_by = '" + orderBy + "'";
    await db.execute(query);
    return true;
}

/**
 * @returns {Array<{genre: string}>}
 */
async function getTrainingClasses() {
    let query = "SELECT * FROM classes_config where active = 1";
    let classes = await db.execute(query);

    return classes[0];
}

module.exports = {getClassesConfig, getEngineConfig, saveClassesConfig, saveTrainConfig, getTrainingClasses};