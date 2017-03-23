/* @navinprasad: test cases for user test  */
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let User = require('./../webserver/models/user.js');
let url = supertest('http://localhost:8080/');


describe('User', () => {

    it('should add the user', (done) => {
        var userMock = sinon.mock(new User({email: 'navin0808@hotmail.com',firstname: 'navin', lastname: 'prasad', loggedinStatus: 0, password: '7r4w8fhjdfeuryqwdh', isEmailVerified: 1, photos: 'www.tinypixls.com/search?q=imAGE&source=lnms&tbm=isch/audi.jpg', domain: ['react', 'design pattern']}));
        var userObj = userMock.object;
        var expectedResult = {
            status: true
        };
        userMock.expects('save').yields(null, expectedResult);
        userObj.save(function(err, result) {
            userMock.verify();
            userMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not add the user', (done) => {
      var userMock = sinon.mock(new User({email: 'navin0808@hotmail.com',firstname: 'navin', lastname: 'prasad', loggedinStatus: 0, password: '7r4w8fhjdfeuryqwdh', isEmailVerified: 1, photos: 'www.tinypixls.com/search?q=imAGE&source=lnms&tbm=isch/audi.jpg', domain: ['react', 'design pattern']}));
        var userObj = userMock.object;
        var expectedResult = {
            status: false
        };
        userMock.expects('save').yields(expectedResult, null);
        userObj.save(function(err, result) {
            userMock.verify();
            userMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should get the user details',(done)=>{
      var userMock = sinon.mock(User);
      var expectedResult = {status:true};

      userMock.expects('find').yields(null, expectedResult);
      User.find(function(err,result){
        userMock.verify();
        userMock.restore();
        expect(result.status).to.be.true;
        done();
      });
  });

  it('should not get the user details',(done)=>{
      var userMock = sinon.mock(User);
      var expectedResult = {status:false };

      userMock.expects('find').yields(expectedResult, null);
      User.find(function(err,result){
        userMock.verify();
        userMock.restore();
        expect(err.status).to.be.false;
        done();
      });
  });

    it('should update the user details',(done)=>{
      var userMock = sinon.mock(new User({email: 'navin0808@hotmail.com',firstname: 'navin', lastname: 'prasad', loggedinStatus: 0, password: '7r4w8fhjdfeuryqwdh', isEmailVerified: 1, photos: 'www.tinypixls.com/search?q=imAGE&source=lnms&tbm=isch/audi.jpg', domain: ['react', 'design pattern'], abusecount: 2}));
      var userObj = userMock.object;
      var expectedResult = {status: true};
      userMock.expects('update').yields(null, expectedResult);
      userObj.update(function(err,result){
        userMock.verify();
        userMock.restore();
        expect(result.status).to.be.true;
        done();
      });
});

it('should not update the user details',(done)=>{
     var userMock = sinon.mock(new User({email: 'navin0808@hotmail.com',firstname: 'navin', lastname: 'prasad', loggedinStatus: 0, password: '7r4w8fhjdfeuryqwdh', isEmailVerified: 1, photos: 'www.tinypixls.com/search?q=imAGE&source=lnms&tbm=isch/audi.jpg', domain: ['react', 'design pattern'], abusecount: 2}));
      var userObj = userMock.object;
      var expectedResult = {status: false};
      userMock.expects('update').yields(expectedResult, null);
      userObj.update(function(err,result){
        userMock.verify();
        userMock.restore();
        expect(err.status).to.not.be.true;
        done();
      });
});
});
