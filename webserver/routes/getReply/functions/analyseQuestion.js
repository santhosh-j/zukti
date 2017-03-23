let client = require('./redis');
let nlp = require('nlp_compromise');
let log4js = require('log4js');
let logger = log4js.getLogger();
/* @vibakar: finds the pronoun and replaces it with previous keyword */
module.exports = function(question, username, lexicon) {
    let tags = nlp.sentence(question).tags();
    let replacingPronoun = '';
    let v = 0;
    for(let j = 0; j < tags.length; j = j + 1)
      {
        logger.debug(tags[j]);
        if(tags[j] === 'Pronoun')
        {
          if(j < tags.length - 1 && (tags[j + 1] === 'Preposition' || tags[j + 1] === 'Determiner'))
          {
            tags[j] = 'Noun';
          }
          else if(j < tags.length - 2 && (tags[j + 2] === 'Preposition'
          || tags[j + 2] === 'Determiner')) {
              tags[j] = 'Noun';
          }
        }
        if(tags[j] === 'Pronoun')
        {
          v = j;
        }
      }
    if (tags.includes('Pronoun')) {
      /* @vibakar: replacing Pronoun with redis keyword */
        client.hget(username, 'keywords', function(err, value) {
            if (value) {
                let replacingArray = nlp.sentence(question).text().split(' ');
                replacingArray[v] = value;
                replacingPronoun = replacingArray.join(' ');
                logger.debug('replaced :' + replacingPronoun);
                lexicon(replacingPronoun);
            } else {
                replacingPronoun = question;
                lexicon(replacingPronoun);
            }
        });
    }
    else {
      replacingPronoun = question;
      lexicon(replacingPronoun);
    }
};
