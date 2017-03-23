// let client = require('./redis');
// let intentRedis = require('./../../redis/functions/redisController');
let log4js = require('log4js');
let logger = log4js.getLogger();
module.exports = function(sentence,intentLexicon,keywordLexicon,typeLexicon) {

  let pos = require('pos');
  logger.debug('inside getReply processQuestion...');
  logger.debug(sentence);

  let nlp = require('nlp_compromise');
    //  logger.debug(intentLexicon);
    let str = nlp.text(sentence);
    // split str into individual words
    let tokens = str.root().split(' ');
    // keywords array will contain keywords extracted from question
    let keywords = [];
    // intent array will contain intents extracted from question
    let intents = [];
    /* @yuvashree: type array will contain types extracted from question */
    let types = [];

    /* @yuvashree: finding the intent using pos */
    let words = new pos.Lexer().lex(sentence);
    let tagger = new pos.Tagger();
    let taggedWords = tagger.tag(words);
    logger.debug(taggedWords+"tags");
    for(let y = 0; y < taggedWords.length; y = y + 1)
    {
      let taggedWord = taggedWords[y];
      let tag = taggedWord[1];
      if(tag !== 'NN' && tag !== 'JJ')
      {
        if(intentLexicon.includes(taggedWord[0]))
        {
          intents.push(taggedWord[0]);
          logger.debug(taggedWord[0]+"pushed word");
        }
      }
      if(y<taggedWords.length-1)
        {
          let taggedWord1 = taggedWords[y+1];
          let tag1 = taggedWord1[1];
          if(tag === 'NN' && tag1 === 'IN')
          {
            if(intentLexicon.includes(taggedWord[0]))
            {
              intents.push(taggedWord[0]);
              logger.debug(taggedWord[0]+"pushed word");
            }
          }
        }
    }
    /* finding intent using nlp done */

    /* iterate over the tokens and search for keywords and intents (if a given token
    is keyword or intent then check the next words for kwyword or intent)*/
    for (let i = 0; i < tokens.length; i = i + 1) {
        let keyword = [];
        let intent = [];
        let type = [];

        // logger.debug(intentLexicon+"intents");
        if(intents.length === 0)
        {
          for (let m = 0; m < intentLexicon.length; m = m + 1) {
              let splitIntent = intentLexicon[m].split('_');
              if (splitIntent[0] === tokens[i]) {
                  let intentPhraseLength = 1;
                  for (let n = 1; n < splitIntent.length && i + 1 < tokens.length; n = n + 1) {
                      if (tokens[i + n] === splitIntent[n]) {
                          intentPhraseLength = intentPhraseLength + 1;
                      } else {
                          break;
                      }
                  }
                  if (intentPhraseLength === splitIntent.length) {
                      intent = splitIntent;
                  }
              }
          }
          if (intent.length !== 0) {
              i = i + intent.length - 1;
              intents.push(intent.join(' '));
              // if intent found skip this iteration
               continue;
          }
        }

        for (let j = 0; j < keywordLexicon.length; j = j + 1) {
            let splitkeyword = keywordLexicon[j].split(' ');
            if (splitkeyword[0] === tokens[i]) {
                let phraseLength = 1;
                logger.debug(splitkeyword[0]+"......."+tokens[i]);
                for (let k = 1; k < splitkeyword.length && i + 1 < tokens.length; k = k + 1) {
                  logger.debug(splitkeyword[k]+"......."+tokens[i+k]);
                    if (tokens[i + k] === splitkeyword[k]) {
                        phraseLength = phraseLength + 1;
                    } else {
                        break;
                    }
                }
                if (phraseLength === splitkeyword.length) {
                    keyword = splitkeyword;
                }
            }
        }
        if (keyword.length !== 0) {
            i = i + keyword.length - 1;
            keywords.push(keyword.join(' '));
        }
        /* @yuvashree: iterate over the tokens and find the types that user requests */
        for (let y = 0; y < typeLexicon.length; y = y + 1) {
            let splittype = typeLexicon[y].split(' ');
            if (splittype[0] === tokens[i]) {
                let typephraseLength = 1;
                if (typephraseLength === splittype.length) {
                    type = splittype;
                }
            }
        }
        if (type.length !== 0) {
            i = i + type.length - 1;
            types.push(type.join(' '));
        }
        logger.debug("its working"+keywords+"........"+intents);
    }
    return {
        keywords,
        intents,
        types
    };
};
