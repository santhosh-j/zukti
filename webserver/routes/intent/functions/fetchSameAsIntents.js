let getNeo4jDriver = require('../../../neo4j/connection');
let log4js = require('log4js');
let logger = log4js.getLogger();
module.exports = function(baseIntent, resultCallback) {
    // get all  same_as intent which have same_as to themselves these are our baseIntent
    let query = `MATCH (baseIntent:intent {name:${JSON.stringify(baseIntent)}})
                 WITH baseIntent.name as x,baseIntent as baseIntent
                 MATCH (sa)-[:same_as]->(baseIntent) where sa.name<>x
                 RETURN COLLECT(sa.name)`;

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
