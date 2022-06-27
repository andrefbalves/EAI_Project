const db = require("./config");

/**
 * @param {string} genre
 * @param {{train_order_by_field, train_order_by}} configs
 * @returns {Array<{id: string, title: string, overview: string, genre: string, poster_path: string, release_date: date, runtime: number, status: string}>}
 */
async function getTrainingSet(genre, configs) {
    let query = "SELECT corpus.* FROM trainingset INNER JOIN corpus ON corpus.imdb_id = trainingset.corpus_id";
    if (genre !== undefined && genre !== '') query += " WHERE genre = '" + genre + "'";
    if (configs !== undefined && configs !== '') query += " ORDER BY " + configs.train_order_by_field + " " + configs.train_order_by;
    let set = await db.execute(query);

    return set[0];
}

/**
 * @returns {Promise<void>}
 */
async function cleanTrainingSet() {
    let query = "TRUNCATE TABLE trainingset";

    await db.execute(query);
}

/**
 * @param {Array<{genre}>} classes
 * @param {{train_order_by_field, train_order_by, train_limit_of_records}} configs
 * @returns {Promise<void>}
 */
async function setTrainingSet(classes, configs) {

    await cleanTrainingSet();

    for (let i = 0; i < classes.length; i++) {
        let query = "INSERT INTO trainingset (corpus_id) " +
                    "SELECT imdb_id FROM corpus " +
                    "WHERE genre = '" + classes[i].genre + "' " +
                    "ORDER BY " + configs.train_order_by_field + " " + configs.train_order_by +
                    " LIMIT " + configs.train_limit_of_records;

        await db.execute(query);
    }
}

module.exports = {getTrainingSet, setTrainingSet};