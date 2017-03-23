/* intent of the file
called from file intent.js (which pass NewIntent parameter to function) */
let nlp = require('nlp_compromise');
let getNeo4jDriver = require('../../../neo4j/connection');
let getLexicon = require('../../../lexicon/getLexicons');

module.exports = function(NewIntent, resultCallback) {
    let newIntent = nlp.text(NewIntent).root();
    let query = `MERGE (n: intent {name:${JSON.stringify(newIntent)}})-[:same_as]->(n)`;
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
