let getNeo4jDriver = require('../../../neo4j/connection');
let log4js = require('log4js');
let logger = log4js.getLogger();
module.exports = function(resultCallback) {
    // get all intent which have same_as to themselves these are our baseIntents
    let query = `MATCH (n:concept) WHERE (n)-[:same_as|:part_of|:actor_of|:sub_concept]->(n)
                  RETURN COLLECT(n.name)`;
    let session = getNeo4jDriver().session();

    session.run(query)
        .then((result) => {
            // Completed!
            session.close();
            resultCallback(result.records[0]._fields[0]);
        })
        .catch((error) => {
            logger.debug(error);
        });
};
