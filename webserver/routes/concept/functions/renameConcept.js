let nlp = require('nlp_compromise');
let getNeo4jDriver = require('../../../neo4j/connection');
let getLexicon = require('../../../lexicon/getLexicons');

module.exports = function(renameConceptText, oldConcept, resultCallback) {
    let conceptRename = nlp.text(renameConceptText).root();
    let OldConcept = nlp.text(oldConcept).root();
    let query = `MATCH (n { name: ${JSON.stringify(OldConcept)}})
                SET n.name = ${JSON.stringify(conceptRename)}
                RETURN n`;
    let session = getNeo4jDriver().session();
    session.run(query).then(() => {
        // Completed!
        session.close();
        // update the lexicon json files in lexicon folder
        getLexicon();
        resultCallback({saved: true});
    }).catch((error) => {
        resultCallback({saved: false});
    });
};
