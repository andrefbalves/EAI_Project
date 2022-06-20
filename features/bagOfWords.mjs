import {exists, idf, numberOfOccurrences, tf, tfidf} from "../preprocessing/counting.mjs";

/**
 * @param {Array<string>} bagOfWords
 * @param {Array<string>} arrayOfWords
 * @returns {Array<string>}
 */
export function addUniqueTerms(bagOfWords, arrayOfWords) {

    for (let i = 0; i < arrayOfWords.length; i++) {
        let x = false;

        for (let j = 0; j < bagOfWords.length; j++) {
            if (exists(arrayOfWords[i], bagOfWords[j]))
                x = true;
        }

        if (x === false)
            bagOfWords.push(arrayOfWords[i])
    }
    return bagOfWords;
}

/**
 * @param {Array<string>} bagOfWords
 * @param {Array<string>} arrayOfTerms
 * @returns {Array<{name: string, binary: number, occurrences: number, tf: number, idf: number, tfidf: number}>}
 */
export function buildVector(bagOfWords, arrayOfTerms) {
    let n = arrayOfTerms.length;
    let termArray = [];

    for (let i = 0; i < bagOfWords.length; i++) {
        let term = {};
        term.name = bagOfWords[i][1] !== undefined ? bagOfWords[i][0] + ' ' + bagOfWords[i][1] : bagOfWords[i][0];

        for (let j = 0; j < arrayOfTerms.length; j++) {
            if (!exists(bagOfWords[i], arrayOfTerms[j])) {
                term.binary = term.binary === 1 ? 1 : 0;
            } else {
                term.binary = 1;
            }
        }

        term.occurrences = numberOfOccurrences(bagOfWords[i], arrayOfTerms);
        term.tf = tf(bagOfWords[i], arrayOfTerms);
        term.idf = idf(n, term.occurrences);
        term.tfidf = tfidf(term.tf, term.idf);

        termArray.push(term);
    }
    return termArray;
}

/**
 * @param {Array<{name, binary: number,occurrences: number, tf: number, idf: number, tfidf:number}>} objectTermArray
 * @param {string} operation average or sum
 * @returns {{name, binary: number, occurrences: number, tf: number, idf:number, tfidf: number}}
 */
export function operateVector(objectTermArray, operation) {
    let objectTerm = {
        name: objectTermArray[0][0].name,
        binary: 0, occurrences: 0, tf: 0, idf: 0, tfidf: 0
    };

    for (let i = 0; i < objectTermArray.length; i++) {
        objectTerm.binary = objectTerm.binary + objectTermArray[i][0].binary;
        objectTerm.occurrences = objectTerm.occurrences + objectTermArray[i][0].occurrences;
        objectTerm.tf = objectTerm.tf + objectTermArray[i][0].tf;
    }

    if (operation === 'average') {
        objectTerm.binary = objectTerm.binary / objectTermArray.length;
        objectTerm.occurrences = objectTerm.occurrences / objectTermArray.length;
        objectTerm.tf = objectTerm.tf / objectTermArray.length;
        objectTerm.idf = objectTermArray[0][0].idf;
        objectTerm.tfidf = tfidf(objectTerm.tf, objectTerm.idf);
    } else if (operation === 'sum') {
        objectTerm.idf = objectTermArray[0][0].idf;
        objectTerm.tfidf = tfidf(objectTerm.tf, objectTerm.idf);
    }

    return objectTerm;
}