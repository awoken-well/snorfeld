import {
    get
} from 'svelte/store'
import {
    fragments
} from './FragmentStore'

import {
    Corpus
} from 'tiny-tfidf'

let corpus = new Corpus(
    [],[]
)

fragments.subscribe((fs) => {
    corpus = new Corpus(
        Object.keys(fs),
        Object.values(fs).map((f) => get(f).parsed.content)
    )
})

export const frequencies = {
    topTerms: (id, maxTerms = 10) => corpus.getTopTermsForDocument(id, maxTerms),
    query: (q) => corpus.getResultsForQuery(q)
}