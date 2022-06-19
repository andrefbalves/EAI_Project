import {db} from "./config.mjs";

export async function getTrainingSet(label) {
    let query = "SELECT * FROM trainingset";
    if (label !== undefined && label !== '') query += " WHERE label = '" + label + "'";
    query +=  " LIMIT 2";
    let set = await db.execute(query);

    return set[0];
}

export async function getTrainingClasses() {
    let query = "SELECT distinct genre FROM corpus INNER JOIN trainingset on corpus.id = trainingset.corpusid";
    let classes = await db.execute(query);

    return classes[0];
}