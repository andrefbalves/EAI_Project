const db = require("./config");

/**
 * @returns {Promise<*>}
 */
async function getClassesConfig() {
    let query = "SELECT * FROM classes_config";
    let classes = await db.execute(query);

    return classes[0];
}

/**
 * @returns {Promise<*>}
 */
async function getEngineConfig() {
    let query = "SELECT * FROM engine_config";
    let configs = await db.execute(query);

    return configs[0][0];
}

/**
 * @param {Array<{genre}>} activesClasses
 * @returns {Promise<boolean>}
 */
async function saveClassesConfig(activesClasses) {
    let query = "UPDATE classes_config SET active = 0";
    await db.execute(query);
    let classes = Array.isArray(activesClasses) ? "'" + activesClasses.join([separator = "','"]) + "'" : "'" + activesClasses + "'";
    query = "UPDATE classes_config SET active = 1 WHERE genre in (" + classes + ")";
    await db.execute(query);
    return true;
}

async function saveTestConfig(limitRecords, metric, operation, typeOfGram) {
    let query = "UPDATE engine_config SET test_limit_of_records = " + limitRecords + ", test_order_by_metric = '" + metric + "', test_operation = '" + operation + "', test_type_of_gram = '" + typeOfGram + "'";
    await db.execute(query);
    return true;
}

/**
 * @param {number} limit
 * @param {string} field
 * @param {string} orderBy
 * @returns {Promise<boolean>}
 */
async function saveTrainConfig(limit, field, orderBy) {
    let query = "UPDATE engine_config SET train_limit_of_records = " + limit + ", train_order_by_field = '" + field + "', train_order_by = '" + orderBy + "'";
    await db.execute(query);
    return true;
}

/**
 * @returns {Promise<*>}
 */
async function getActiveClasses() {
    let query = "SELECT * FROM classes_config where active = 1";
    let classes = await db.execute(query);

    return classes[0];
}

module.exports = {getClassesConfig, getEngineConfig, saveClassesConfig, saveTrainConfig, getActiveClasses, saveTestConfig};