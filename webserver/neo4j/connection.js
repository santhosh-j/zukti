let neo4j = require('neo4j-driver').v1;
module.exports = function() {

let driver = neo4j.driver("bolt://192.168.1.55:16787", neo4j.auth.basic('neo4j', 'neo4js'));
    return driver;
};
