/* @navinprasad: test cases for user notification count */
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let UserNotificationCount = require('./../webserver/models/userNotificationCount.js');
let url = supertest('http://localhost:8080/');


describe('User Notification Count', () => {

    it('should save the user notification', (done) => {
        var userNotificationCountMock = sinon.mock(new UserNotificationCount({email: 'navin0808@hotmail.com', count: 3}));
        var userNotificationCountObj = userNotificationCountMock.object;
        var expectedResult = {
            status: true
        };
        userNotificationCountMock.expects('save').yields(null, expectedResult);
        userNotificationCountObj.save(function(err, result) {
            userNotificationCountMock.verify();
            userNotificationCountMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not save the user notification', (done) => {
        var userNotificationCountMock = sinon.mock(new UserNotificationCount({email: 'navin0808@hotmail.com', count: 4}));
        var userNotificationCountObj = userNotificationCountMock.object;
        var expectedResult = {
            status: false
        };
        userNotificationCountMock.expects('save').yields(expectedResult, null);
        userNotificationCountObj.save(function(err, result) {
            userNotificationCountMock.verify();
            userNotificationCountMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should get the user notification',(done)=>{
      var userNotificationCountMock = sinon.mock(UserNotificationCount);
      var expectedResult = {status:true};

      userNotificationCountMock.expects('find').yields(null, expectedResult);
      UserNotificationCount.find(function(err,result){
        userNotificationCountMock.verify();
        userNotificationCountMock.restore();
        expect(result.status).to.be.true;
        done();
      });
  });

  it('should not get the user notification',(done)=>{
      var userNotificationCountMock = sinon.mock(UserNotificationCount);
      var expectedResult = {status:false };

      userNotificationCountMock.expects('find').yields(expectedResult, null);
      UserNotificationCount.find(function(err,result){
        userNotificationCountMock.verify();
        userNotificationCountMock.restore();
        expect(err.status).to.be.false;
        done();
      });
  });

    it('should update the user notification count',(done)=>{
      var userNotificationCountMock = sinon.mock(new UserNotificationCount({email: 'navin0808@hotmail.com', count: 1}));
      var userNotificationCountObj = userNotificationCountMock.object;
      var expectedResult = {status: true};
      userNotificationCountMock.expects('update').yields(null, expectedResult);
      userNotificationCountObj.update(function(err,result){
        userNotificationCountMock.verify();
        userNotificationCountMock.restore();
        expect(result.status).to.be.true;
        done();
      });
});

it('should not update the user notification count',(done)=>{
      var userNotificationCountMock = sinon.mock(new UserNotificationCount({email: 'navin0808@hotmail.com', count: 0}));
      var userNotificationCountObj = userNotificationCountMock.object;
      var expectedResult = {status: false};
      userNotificationCountMock.expects('update').yields(expectedResult, null);
      userNotificationCountObj.update(function(err,result){
        userNotificationCountMock.verify();
        userNotificationCountMock.restore();
        expect(err.status).to.not.be.true;
        done();
      });
});

});
