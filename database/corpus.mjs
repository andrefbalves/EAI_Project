import {db} from "./config.mjs";

export async function getClasses() {
    let query = "SELECT distinct genre FROM eai_project.corpus";
    let classes = await db.execute(query);

    return classes[0];
}

export async function getDocuments(label, limit) {
    let query = "SELECT * FROM corpus WHERE label = '" + label + "'";
    if (limit !== undefined && limit !== '') query += " LIMIT " + limit.toString();
    let docs = await db.execute(query);

    return docs[0];
}