let chai = require('chai');
let expect = chai.expect;
let swearChecker = require('../webserver/routes/filterAbuse/functions/filterAbuse.js');

describe('Run series of test for Swear checker', function() {
  it("should not result in error", function(done) {
     done();
   });
   it('should fail if question is not provided', function() {
        expect(swearChecker).to.throw(Error, "Not a String");
    });

   it('should fail if question is not a String', function() {
        expect(swearChecker.bind({})).to.throw(Error, "Not a String");
    });

  it('should fail if the question is a literal number', function() {
        expect(swearChecker.bind(5432)).to.throw(Error, "Not a String");
    });

   it('should fail if the question is a Number object', function(){
        expect(swearChecker.bind(Number(5678))).to.throw(Error, "Not a String");
    });

 });
