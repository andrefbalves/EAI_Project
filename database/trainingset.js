const db = require("./config");

/**
 * @param {string} genre
 * @returns {Array<{id: string, title: string, overview: string, genre: string, poster_path: string, release_date: date, runtime: number, status: string}>}
 */
async function getTrainingSet(genre) {
    let query = "SELECT corpus.* FROM trainingset INNER JOIN corpus ON corpus.imdb_id = trainingset.corpus_id";
    if (genre !== undefined && genre !== '') query += " WHERE genre = '" + genre + "'";
    //query +=  " LIMIT 2";
    let set = await db.execute(query);

    return set[0];
}

/**
 * @returns {Array<{genre: string}>}
 */
async function getTrainingClasses() {
    let query = "SELECT * FROM classes_config where active = 1";
    let classes = await db.execute(query);

    return classes[0];
}

module.exports = {getTrainingSet, getTrainingClasses};