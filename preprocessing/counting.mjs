/**
 * @param {string} term
 * @param {string} text
 * @returns {boolean}
 */
export function exists(term, text) {
    return JSON.stringify(term) === JSON.stringify(text);
}

/**
 * @param {string} term
 * @param {Array<string>} arrayOfTerms
 * @returns {number}
 */
export function numberOfOccurrences(term, arrayOfTerms) {
    let count = 0;

    for (let i = 0; i < arrayOfTerms.length; i++) {
        if (exists(term, arrayOfTerms[i]))
            count = count + 1;
    }
    return count;
}

/**
 * @param {string} term
 * @param {Array<string>} arrayOfTerms
 * @returns {number}
 */
export function tf(term, arrayOfTerms) {
    return numberOfOccurrences(term, arrayOfTerms) / arrayOfTerms.length;
}

/**
 * @param {number} n
 * @param {number} dt
 * @returns {number|number}
 */
export function idf(n, dt) {
    return dt === 0 ? 0 : Math.log10(n/dt);
}

/**
 * @param {number} tf
 * @param {number} idf\\
 * @returns {number}
 */
export function tfidf(tf, idf) {
    return tf * idf;
}