// add intent same as to some intent
let nlp = require('nlp_compromise');
let getNeo4jDriver = require('../../../neo4j/connection');
let getLexicon = require('../../../lexicon/getLexicons');
module.exports = function(baseIntent, newSameAsIntent, resultCallback) {
    let newSameAsIntentNormalized = nlp.text(newSameAsIntent).root();
    // query to match intent and merge new intent with it
    let query = `MATCH (n:intent {name:${JSON.stringify(baseIntent)}})
                 MERGE (:intent {name:${JSON.stringify(newSameAsIntentNormalized)}})
                 -[:same_as]->(n)`;
    let session = getNeo4jDriver().session();
    session.run(query)
        .then((result) => {
            // Completed!
            session.close();
            // update the lexicon json files in lexicon folder
            getLexicon();
            resultCallback({
                saved: true
            });
        })
        .catch((error) => {
            resultCallback({
                saved: false
            });
        });
};
