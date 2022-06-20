import {exists} from "../preprocessing/counting.mjs";

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