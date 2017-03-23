let Filter = require('bad-words');
let filter = new Filter();
//  @Mayanka  initial swear count is zero
let count = 0;
module.exports = function (word) {
  if(typeof word !== 'string') {
    throw new Error('Not a String');
  }
  //  @Mayanka  Mayanka :  cleaning the sentence will replace the swear word with '*'

  let findAbuse = filter.clean(word);
  let firstIndexOfAbuse = 0;
  let lastIndexOfAbuse = 0;
  let swearWord = '';
  let swearPresent = false;
  //  @Mayanka :  find out if there was a swear word by using *
  if(findAbuse.includes('*')) {
    swearPresent = true;
    count = count + 1;
}
//  @Mayanka if count is greater than 0 , swear is present so variable swearPresent becomes true
//  @Mayanka  find out the swear word
firstIndexOfAbuse = findAbuse.indexOf('*');
lastIndexOfAbuse = findAbuse.lastIndexOf('*');
swearWord = word.substring(firstIndexOfAbuse, lastIndexOfAbuse + 1);
//  @Mayanka  returns if swear was present along with count
return{
   count,
   swearPresent
};
};
