let nlp = require('nlp_compromise');
let getNeo4jDriver = require('../../../neo4j/connection');
let getLexicon = require('../../../lexicon/getLexicons');

module.exports = function(newConcept, relationship, oldConcept, resultCallback) {
    // @vibakar: cypher query for adding new concepts to existing concepts
    let query = `MATCH (m:concept{name:${JSON.stringify(oldConcept)}})
                MERGE (n:concept {name:${JSON.stringify(newConcept)}})-[:${relationship}]->(m)`;
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
