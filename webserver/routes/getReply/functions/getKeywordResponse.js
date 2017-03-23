// function to take keywords and return response from neo4j database
let getNeo4jDriver = require('../../../neo4j/connection');
let answerNotFoundReply = require('../../../config/answerNotFoundReply');
let replyForKeyword = require('../../../config/replyForKeyword.json');
let User = require('./../../../models/user');
let client = require('./redis');
let log4js = require('log4js');
let logger = log4js.getLogger();
module.exports = function(keywords, email, types, sendResponse, otherDomainResponse, flag, correctedQuestion) {
    /* @yuvashree: find domain from db using email id */
    User.findOne({
        $or: [
            {
                'local.email': email
            }, {
                'google.email': email
            }, {
                'facebook.email': email
            }
        ]
    }, function(error, data) {
        if (error) {
            return error;
        }
        let domain = data.local.loggedinDomain;
        let query = '';
        let intent = '';
        let type = '';
        let inOtherDomain = '';
        let differentDomain = '';
        getIntent();
        /* @navinprasad: find the base node */
        function getIntent()
        {
          if(types.length === 0)
          {
            intentCallBack(intent);
          }
          else {
            client.hmget('types', types[types.length-1],function(err, reply) {
            logger.debug(reply);
            type = reply;
            intentCallBack(intent);
            });
          }
      }
        function intentCallBack(intent)
        {
        // query to extract data
        /* @yuvashree: modified query for multiple relationships and different domain for normal question */
        if (types.length === 0) {
          query = `UNWIND ${JSON.stringify(keywords)} AS token
              MATCH (n:concept)
              WHERE n.name = token
              OPTIONAL MATCH (n)-[r:same_as]->(main)
              WITH COLLECT(main) AS baseWords
              UNWIND baseWords AS token
              MATCH p=(token)-[:part_of|:subconcept|:actor_of|:same_as*]->(:concept{name:'${domain}'})
              WITH length(p) AS max,baseWords AS baseWords
              UNWIND baseWords AS bw
              match p=(bw)-[:part_of|:subconcept|:actor_of|:same_as*]->(:concept{name:'${domain}'})
              WHERE length(p) = max
              WITH bw as bw
              MATCH (n)<-[:answer]-(q:question)-->(bw) where n:blog or n:video or n:image or n:code
              RETURN LABELS(n) AS contentType, COLLECT(DISTINCT[n.value, ANY(user IN n.likes WHERE user='${email}'), ANY(user IN n.dislikes WHERE user='${email}')]),
              CASE
                  WHEN SIZE(n.likes)=0 AND SIZE(n.dislikes)=0 THEN 0
                  WHEN SIZE(n.likes)=0 AND SIZE(n.dislikes)>0 THEN -SIZE(n.dislikes)
                  WHEN SIZE(n.likes)>0 AND SIZE(n.dislikes)>=0 THEN (SIZE(n.likes)*100)/(SIZE(n.likes)+SIZE(n.dislikes))
              END
             AS rating
             ORDER BY rating DESC`;
        }
        /* @yuvashree: modified query for multiple relationships and different domain for type specific question */
        else {
          query = `UNWIND ${JSON.stringify(keywords)} AS token
            MATCH (n:concept)
            WHERE n.name = token
            OPTIONAL MATCH (n)-[r:same_as]->(main)
            WITH COLLECT(main) AS baseWords
            UNWIND baseWords AS token
            MATCH p=(token)-[:part_of|:subconcept|:actor_of|:same_as*]->(:concept{name:'${domain}'})
            WITH length(p) AS max,baseWords AS baseWords
            UNWIND baseWords AS bw
            match p=(bw)-[:part_of|:subconcept|:actor_of|:same_as*]->(:concept{name:'${domain}'})
            WHERE length(p) = max
            WITH bw as bw
            MATCH (n)<-[:answer]-(q:question)-->(bw) WHERE LABELS(n)='${type[0]}'
            RETURN LABELS(n) AS contentType, COLLECT(DISTINCT[n.value, ANY(user IN n.likes WHERE user='${email}'), ANY(user IN n.dislikes WHERE user='${email}')]),
            CASE
             WHEN SIZE(n.likes)=0 AND SIZE(n.dislikes)=0 THEN 0
             WHEN SIZE(n.likes)=0 AND SIZE(n.dislikes)>0 THEN -SIZE(n.dislikes)
             WHEN SIZE(n.likes)>0 AND SIZE(n.dislikes)>=0 THEN (SIZE(n.likes)*100)/(SIZE(n.likes)+SIZE(n.dislikes))
            END
            AS rating
            ORDER BY rating DESC`;
             }
        let session = getNeo4jDriver().session();
        session.run(query).then(function(result) {
            // Completed!
            session.close();
            // condition to handle when no result is found
            /* @Sindhujaadevi: To find whether the keyword is from different domain or not */
            if (result.records.length === 0) {
                // generating answer and send response
                client.hmget('keywords', keywords[keywords.length-1],function(err, reply) {
                differentDomain = reply[0];
                if(domain!== differentDomain){
                  inOtherDomain = true;
                }
                otherDomainResponse(inOtherDomain, differentDomain);
                  });
            } else {

              let hasAtleastSomeContent = false;
              let resultArray = [];
              let resultObj = {};
              let blogArray = [];
              let videoArray = [];
              let codeArray = [];
              let imageArray = [];
              let textArray = [];
                result.records.forEach((record) => {
                  let field = record._fields;
                  let contentType = field[0][0];
                  hasAtleastSomeContent = true;
                  field[1].map((value, index) =>{
                  let content = {value: value[0], likes: value[1], dislikes: value[2]}
                  if(contentType === 'blog') {
                      blogArray.push(content);
                    } else if(contentType === 'video') {
                      videoArray.push(content);
                    } else if(contentType === 'code') {
                      codeArray.push(content);
                    } else if(contentType === 'image') {
                      imageArray.push(content);
                    } else if(contentType === 'text') {
                      textArray.push(content);
                    }
                      });
                });
                resultObj.time = new Date().toLocaleString();
                if(blogArray.length > 0) {
                  resultObj['blog'] = blogArray;
                }
                if(videoArray.length > 0) {
                  resultObj['video'] = videoArray;
                }
                if(codeArray.length > 0) {
                  resultObj['code'] = codeArray;
                }
                if(imageArray.length > 0) {
                  resultObj['image'] = imageArray;
                }
                if(textArray.length > 0) {
                  resultObj['text'] = textArray;
                }
            /* @sangeetha: keywords for recommendations */
                resultObj.keywords = keywords;
                if (hasAtleastSomeContent) {
                  //  @Mayanka: If spell check done show this message
                    if (flag == 1) {
                        resultObj.value = 'Showing results for : ' +
                            "\"" + correctedQuestion + "\"" + ' instead';
                    }
                  //  @Mayanka: no matching keyword found
                    else {
                        resultObj.value = replyForKeyword[Math.floor(Math.random() * replyForKeyword.length)];
                    }
                    resultArray.push(resultObj);
                    resultObj.keywordResponse = true;
                    sendResponse(true, resultArray);
                } else {
                    resultObj.value = answerNotFoundReply[Math.floor(Math.random() * answerNotFoundReply.length)];
                    resultArray.push(resultObj);
                    sendResponse(true, resultArray);
                }
            }
        }).catch(function(error) {
            logger.debug(error);
        });
      }
    });
};
