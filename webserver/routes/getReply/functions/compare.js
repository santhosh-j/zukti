module.exports = function(userQuery,title)
{
  let wordCount = 0;
  for (let u = 0; u < userQuery.length; u++) {
      for (let t = 0; t < title.length; t++) {
          if (userQuery[u] === title[t]) {
              wordCount++;
          }
      }
  }
  return wordCount;
}
