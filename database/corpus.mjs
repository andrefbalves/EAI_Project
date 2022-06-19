import {db} from "./config.mjs";

export async function getDocuments(label, limit) {
    let query = "SELECT * FROM corpus WHERE label = '" + label + "'";
    if (limit !== undefined && limit !== '') query += " LIMIT " + limit.toString();
    let docs = await db.execute(query);

    return docs[0];
}