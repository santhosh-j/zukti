let chai = require('chai');
let expect = chai.expect;
let spellChecker = require('../webserver/routes/spellChecker/functions/spellChecker.js');

describe('Run series of test for  spell checker checker', function() {
  it("should not result in error", function(done) {
     done();
   });
   it('should fail if question is not provided', function() {
        expect(spellChecker).to.throw(Error, "Not a String");
    });

   it('should fail if question is not a string', function() {
        expect(spellChecker.bind({})).to.throw(Error, "Not a String");
    });

  it('should fail if the question is a literal number', function() {
        expect(spellChecker.bind(5432)).to.throw(Error, "Not a String");
    });

   it('should fail if the question is a Number object', function(){
        expect(spellChecker.bind(Number(5678))).to.throw(Error, "Not a String");
    });

 });
