import {db} from "./config.mjs";

/**
 * @param {string} genre
 * @returns {Array<{id: string, title: string, overview: string, genre: string, poster_path: string, release_date: date, runtime: number, status: string}>}
 */
export async function getTrainingSet(genre) {
    let query = "SELECT corpus.* FROM trainingset INNER JOIN corpus ON corpus.imdb_id = trainingset.corpus_id";
    if (genre !== undefined && genre !== '') query += " WHERE genre = '" + genre + "'";
    query +=  " LIMIT 2";
    let set = await db.execute(query);

    return set[0];
}

/**
 * @returns {Array<{genre: string}>}
 */
export async function getTrainingClasses() {
    let query = "SELECT distinct genre FROM corpus INNER JOIN trainingset on corpus.imdb_id = trainingset.corpus_id ORDER BY genre";
    query +=  " LIMIT 2";
    let classes = await db.execute(query);

    return classes[0];
}