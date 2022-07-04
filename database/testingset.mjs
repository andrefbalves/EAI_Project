import {db} from "./config.mjs";


export async function getTestingSet(configs) {
    let query = "SELECT corpus.* FROM test_set INNER JOIN corpus ON corpus.imdb_id = test_set.corpus_id";
    if (configs !== undefined && configs !== '') query += " ORDER BY " + configs.test_order_by_field + " " + configs.test_order_by;
    let set = await db.execute(query);

    return set[0];
}


export async function cleanTestingSet() {
    let query = "TRUNCATE TABLE test_set";

    await db.execute(query);
}

export async function setTestingSet(classes, limit_of_records, order_by_field, order_by) {

    await cleanTestingSet();

    for (let i = 0; i < classes.length; i++) {
        let query = "INSERT INTO test_set (corpus_id) " +
            "SELECT imdb_id FROM corpus LEFT JOIN training_set ON corpus.imdb_id = training_set.corpus_id WHERE training_set.corpus_id IS NULL " +
            "AND genre = '" + classes[i].genre + "' " +
            "ORDER BY " + order_by_field + " " + order_by +
            " LIMIT " + limit_of_records;

        await db.execute(query);
    }
}