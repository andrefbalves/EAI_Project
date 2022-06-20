/**
 * @param {string} docText
 * @returns {string}
 */
function lowerText(docText) {
    return docText.toLowerCase();
}

/**
 * @param {string} docText
 * @returns {string}
 */
function removeSpaces(docText) {
    return docText.replace(/^\s|\s$|\s{2,}/gm, ' ').trim();
}

/**
 * @param {string} docText
 * @returns {string}
 */
function removeSpecificChars(docText) {
    return docText.replace(/[^\w\s]|_|\d/g, '');
}

/**
 * @param {string} docText
 * @returns {string}
 */
export function cleanText(docText) {
    return removeSpaces(removeSpecificChars(lowerText(docText)));
}