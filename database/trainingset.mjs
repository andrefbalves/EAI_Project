import {db} from "./config.mjs";

/**
 * @param {string} genre
 * @param {{train_order_by_field, train_order_by}} configs
 * @returns {Array<{id: string, title: string, overview: string, genre: string, poster_path: string, release_date: date, runtime: number, status: string}>}
 */
export async function getTrainingSet(genre, configs) {
    let query = "SELECT corpus.* FROM training_set INNER JOIN corpus ON corpus.imdb_id = training_set.corpus_id";
    if (genre !== undefined && genre !== '') query += " WHERE genre = '" + genre + "'";
    if (configs !== undefined && configs !== '') query += " ORDER BY " + configs.train_order_by_field + " " + configs.train_order_by;
    let set = await db.execute(query);

    return set[0];
}

/**
 * @returns {Promise<void>}
 */
async function cleanTrainingSet() {
    let query = "TRUNCATE TABLE training_set";

    await db.execute(query);
}

/**
 * @param {Array<{string}>} classes
 * @param {number} limit_of_records
 * @param {string} order_by_field
 * @param {string} order_by
 * @returns {Promise<void>}
 */
export async function setTrainingSet(classes, limit_of_records, order_by_field, order_by) {

    await cleanTrainingSet();

    for (let i = 0; i < classes.length; i++) {
        let query = "INSERT INTO training_set (corpus_id) " +
                    "SELECT imdb_id FROM corpus " +
                    "WHERE genre = '" + classes[i] + "' " +
                    "ORDER BY " + order_by_field + " " + order_by +
                    " LIMIT " + limit_of_records;

        await db.execute(query);
    }
}