module.exports = function (question) {
	if(typeof question !== 'string') {
    throw new Error('Not a String');
  }
	let natural = require('natural');
	let Spellchecker = require('./hunspell-spellchecker');
	let fs = require('fs');
	let spellchecker = new Spellchecker();
//  @Mayanka :importing the dictionary files
	let DICT = spellchecker.parse({
		aff: fs.readFileSync('./en_US.aff'),
		dic: fs.readFileSync('./en_US.dic')});
	let tokenizer = new natural.WordTokenizer();
	//  @Mayanka : importing the file having domain related data
	let text = fs.readFileSync('lotsofwords.txt', 'utf-8');
	let corpus = tokenizer.tokenize(text);
	let spellcheck = new natural.Spellcheck(corpus);
	let spellChecked = '';
	//  @Mayanka :	flag to indicate if spellcheck was done
  let flag = 0;
let sentence = question.split(' ');
//  @Mayanka :	passing the question,word by word
sentence.forEach(function(word)
{
if(!spellchecker.check(word))
{
	spellChecked = spellcheck.getCorrections(word)[0];
	question = question.replace(word, spellChecked);
}
});
//  @Mayanka : strArray to verify with spell corrected sentence
let strArray = question.trim().split(' ');
//  @Mayanka :	check for spellcheck in any word
 for(let i in sentence)
 {
    if(sentence[i] !== strArray[i])
		{
      flag = 1;
        break;
    }
  }
	//	@Mayanka : returns spellcorrected question and flag status
    return {
    question,
    flag
  };
};
