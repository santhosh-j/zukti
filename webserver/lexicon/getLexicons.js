let getNeo4jDriver = require('../neo4j/connection');
let fs = require('fs');
/* redis client */
let redis = require('redis');
let client = redis.createClient(); // Creating redis client with default port name and host name as 127.0.0.1 and 6379 respectively

// delete require.cache[require.resolve('./intentLexicon.json')];
function createLexiconFiles(result) {

  let intentTerms = [];
  let baseIntents = [];
  let domain = [];
  let keywordTerms = [];

   let answerTypes = ["video", "video", "view", "video", "display", "video", "show", "video", "download",
"video", "record", "video", "clip", "video", "website", "blog", "webpage", "blog", "link", "blog","blog","blog" ];

let log4js = require('log4js');
let logger = log4js.getLogger();

  //  logger.debug(result.records.length+"redis data");

  for(let k = 0 ; k<result.records.length ; k++)
    {
      intentTerms = result.records[k]._fields[0];
      baseIntents = result.records[k]._fields[1];
      keywordTerms.push(result.records[k]._fields[2]);
      domain.push(result.records[k]._fields[3]);
    }

  /* @navinprasad: add all the intents, keywords, types to redis */
  for (let i = 0; i < intentTerms.length; i = i + 1) {
      /* inserting 'intents' in redis */
      client.hmset(['intents', intentTerms[i], baseIntents[i]], function(err, reply) {
          if (err) {
              throw(err);
          }
      });
  }

  for (let i = 0; i < keywordTerms.length; i = i + 1) {
      /* inserting 'keywords' in redis */
      for(let j = 0; j < keywordTerms[i].length; j = j + 1) {
      client.hmset(['keywords', keywordTerms[i][j], domain[i]], function(err, reply) {
          if (err) {
              throw(err);
          }
      });
    }
  }

 for (let i = 0; i < answerTypes.length; i = i + 2) {
  // client.hmset();
  client.hmset(['types', answerTypes[i], answerTypes[i+1]], function(err, reply) {
           if (err) {
               throw(err);
           }
       });
   }
 }
module.exports = function() {
  /* query to get all concept words, types and intents */
  let query = `MATCH (m:intent)-[:same_as]->(n:intent) with collect(m.name) as intent,collect(n.name) as base
  match (k:concept)-[:part_of|:subconcept|:actor_of|:same_as*]->(v:domain) with intent as intent,base as base,COLLECT(distinct k.name) as keyword,v.name as basekeyword
   RETURN intent,base,keyword,basekeyword`;

  let session = getNeo4jDriver().session();
  session.run(query).then(function(result) {
      // Completed!
      session.close();
      createLexiconFiles(result);
  }).catch(function(error) {
      logger.debug(error);
  });
};
