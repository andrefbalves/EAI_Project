import {db} from "./config.mjs";

/**
 * @returns {Promise<*>}
 */
export async function getResults() {
    let query = "SELECT * FROM results";
    let set = await db.execute(query);

    return set[0];
}