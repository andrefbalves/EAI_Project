const db = require("./config");

/**
 * @param {string} genre
 * @param {number} limit
 * @returns {Array.<docs>}
 */
async function getDocuments(genre, limit) {//todo checkar se é preciso esta ação
    let query = "SELECT * FROM corpus ";
    if (genre !== undefined && genre !== '') query += "  WHERE genre = '" + genre + "'";
    if (limit !== undefined && limit !== 0) query += " LIMIT " + limit.toString();
    let docs = await db.execute(query);

    return docs[0];
}

module.exports = {getDocuments};