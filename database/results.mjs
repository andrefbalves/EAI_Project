import {db} from "./config.mjs";

/**
 * @returns {Promise<*>}
 */
export async function getResults() {
    let query = "SELECT * FROM results";
    let set = await db.execute(query);

    return set[0];
}

/**
 * @returns {Promise<void>}
 */
async function cleanResults() {
    let query = "TRUNCATE TABLE results";

    await db.execute(query);
}

/**
 * @param results
 * @returns {Promise<void>}
 */
export async function saveResults(results) {

    await cleanResults();

    for (let i = 0; i < results.length; i++) {
        let query = 'INSERT INTO results (overview, cosine_class, bayes_class, real_class)' +
            ' VALUES ("' + results[i].doc + '", "' + results[i].cosineClass.genre + '", "' + results[i].bayesClass.genre + '", "' + results[i].realClass + '" )';

        await db.execute(query);
    }
}