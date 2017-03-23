/* @navinprasad: test cases for notification count */
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let NotificationCount = require('./../webserver/models/notificationCount.js');
let url = supertest('http://localhost:8080/');


describe('Notification Count', () => {

    it('should save the notification', (done) => {
        var notificationCountMock = sinon.mock(new NotificationCount({email: 'navin0808@hotmail.com', countOfNotification: 3}));
        var notificationCountObj = notificationCountMock.object;
        var expectedResult = {
            status: true
        };
        notificationCountMock.expects('save').yields(null, expectedResult);
        notificationCountObj.save(function(err, result) {
            notificationCountMock.verify();
            notificationCountMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not save the notification', (done) => {
        var notificationCountMock = sinon.mock(new NotificationCount({email: 'navin0808@hotmail.com', countOfNotification: 4}));
        var notificationCountObj = notificationCountMock.object;
        var expectedResult = {
            status: false
        };
        notificationCountMock.expects('save').yields(expectedResult, null);
        notificationCountObj.save(function(err, result) {
            notificationCountMock.verify();
            notificationCountMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should get the notification',(done)=>{
      var notificationCountMock = sinon.mock(NotificationCount);
      var expectedResult = {status:true};

      notificationCountMock.expects('find').yields(null, expectedResult);
      NotificationCount.find(function(err,result){
        notificationCountMock.verify();
        notificationCountMock.restore();
        expect(result.status).to.be.true;
        done();
      });
  });

  it('should not get the notification',(done)=>{
      var notificationCountMock = sinon.mock(NotificationCount);
      var expectedResult = {status:false };

      notificationCountMock.expects('find').yields(expectedResult, null);
      NotificationCount.find(function(err,result){
        notificationCountMock.verify();
        notificationCountMock.restore();
        expect(err.status).to.be.false;
        done();
      });
  });

    it('should update the notification count',(done)=>{
      var notificationCountMock = sinon.mock(new NotificationCount({email: 'navin0808@hotmail.com', countOfNotification: 1}));
      var notificationCountObj = notificationCountMock.object;
      var expectedResult = {status: true};
      notificationCountMock.expects('update').yields(null, expectedResult);
      notificationCountObj.update(function(err,result){
        notificationCountMock.verify();
        notificationCountMock.restore();
        expect(result.status).to.be.true;
        done();
      });
});

it('should not update the notification count',(done)=>{
      var notificationCountMock = sinon.mock(new NotificationCount({email: 'navin0808@hotmail.com', countOfNotification: 0}));
      var notificationCountObj = notificationCountMock.object;
      var expectedResult = {status: false};
      notificationCountMock.expects('update').yields(expectedResult, null);
      notificationCountObj.update(function(err,result){
        notificationCountMock.verify();
        notificationCountMock.restore();
        expect(err.status).to.not.be.true;
        done();
      });
});


});
