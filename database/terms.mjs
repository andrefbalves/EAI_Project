import {db} from "./config.mjs";

/**
 * @returns {Promise<void>}
 */
export async function cleanTerms() {
    let query = "TRUNCATE TABLE terms";

    await db.execute(query);
}

/**
 * @param {{class, bagOfUnigrams, bagOfBigrams}} trainingClass
 * @returns {Promise<void>}
 */
export async function saveTerms(trainingClass) {
    let query = "INSERT INTO terms (genre, operation, typeOfGram, name, `binary`, occurrences, tf, idf, tfidf) VALUES ";

    for (let i = 0; i < trainingClass.bagOfUnigrams.length; i++) {

        query += " ('" + trainingClass.class
            + "', 'sum', 'unigram', '`"
            + trainingClass.bagOfUnigrams[i].sum.name + "`', "
            + trainingClass.bagOfUnigrams[i].sum.binary + ", "
            + trainingClass.bagOfUnigrams[i].sum.occurrences + ", "
            + trainingClass.bagOfUnigrams[i].sum.tf + ", "
            + trainingClass.bagOfUnigrams[i].sum.idf + ", "
            + trainingClass.bagOfUnigrams[i].sum.tfidf + "),";
        query += " ('" + trainingClass.class
            + "', 'average', 'unigram', '`"
            + trainingClass.bagOfUnigrams[i].average.name + "`', "
            + trainingClass.bagOfUnigrams[i].average.binary + ", "
            + trainingClass.bagOfUnigrams[i].average.occurrences + ", "
            + trainingClass.bagOfUnigrams[i].average.tf + ", "
            + trainingClass.bagOfUnigrams[i].average.idf + ", "
            + trainingClass.bagOfUnigrams[i].average.tfidf + "),";
    }

    for (let i = 0; i < trainingClass.bagOfBigrams.length; i++) {

        query += " ('" + trainingClass.class
            + "', 'sum', 'bigram', '`"
            + trainingClass.bagOfBigrams[i].sum.name + "`', "
            + trainingClass.bagOfBigrams[i].sum.binary + ", "
            + trainingClass.bagOfBigrams[i].sum.occurrences + ", "
            + trainingClass.bagOfBigrams[i].sum.tf + ", "
            + trainingClass.bagOfBigrams[i].sum.idf + ", "
            + trainingClass.bagOfBigrams[i].sum.tfidf + "),";
        query += " ('" + trainingClass.class
            + "', 'average', 'bigram', '`"
            + trainingClass.bagOfBigrams[i].average.name + "`', "
            + trainingClass.bagOfBigrams[i].average.binary + ", "
            + trainingClass.bagOfBigrams[i].average.occurrences + ", "
            + trainingClass.bagOfBigrams[i].average.tf + ", "
            + trainingClass.bagOfBigrams[i].average.idf + ", "
            + trainingClass.bagOfBigrams[i].average.tfidf + "),";
    }
    query = query.replace(/.$/gm, '');//to delete the last comma

    await db.execute(query);
}

/**
 * @returns {Promise<void>}
 */
export async function cleanTemplate() {
    let query = "UPDATE terms SET name = replace(name, '`','')";

    await db.execute(query);
}

/**
 * @param {string} genre
 * @param {{class_operation, class_operation, class_type_of_gram, class_order_by_metric, class_limit_of_records}} configs
 * @returns {Promise<*>}
 */
export async function selectKBest(genre, configs) {

    let query = "SELECT * FROM terms WHERE operation = '" + configs.class_operation + "'";
    if (genre !== undefined && genre !== 'All' && genre !== '') query += " AND genre = '" + genre + "'";
    if (configs.class_type_of_gram !== undefined && configs.class_type_of_gram !== 'All' && configs.class_type_of_gram !== '') query += " AND typeOfGram = '" + configs.class_type_of_gram + "'";
    if (configs.class_order_by_metric !== undefined && configs.class_order_by_metric !== '') query += " ORDER BY `" + configs.class_order_by_metric + "` DESC";
    if (configs.class_limit_of_records !== undefined && configs.class_limit_of_records !== '0') query += " LIMIT " + configs.class_limit_of_records;
    let terms = await db.execute(query);

    return terms[0];
}