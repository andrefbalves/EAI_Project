import { nGram } from 'n-gram';

export function ngram(n, text) {
    return nGram(n)(text);
}

//console.log(ngram(1,'a really Interesting string with some words'.split(" ")));