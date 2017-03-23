/* @navinprasad: test cases for ginni analytics */
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let GinniAnalytics = require('./../webserver/models/ginniAnalytics.js');
let url = supertest('http://localhost:8080/');

describe('ginni analytics', () => {

    it('should save the questions asked and unanswered questions', (done) => {
        var ginniAnalyticsMock = sinon.mock(new GinniAnalytics({queriesAsked: 10, unanswered: 5}));
        var ginniAnalyticsObj = ginniAnalyticsMock.object;
        var expectedResult = {
            status: true
        };
        ginniAnalyticsMock.expects('save').yields(null, expectedResult);
        ginniAnalyticsObj.save(function(err, result) {
            ginniAnalyticsMock.verify();
            ginniAnalyticsMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not save the questions asked and unanswered questions', (done) => {
        var ginniAnalyticsMock = sinon.mock(new GinniAnalytics({queriesAsked: 10, unanswered: 5}));
        var ginniAnalyticsObj = ginniAnalyticsMock.object;
        var expectedResult = {
            status: false
        };
        ginniAnalyticsMock.expects('save').yields(expectedResult, null);
        ginniAnalyticsObj.save(function(err, result) {
            ginniAnalyticsMock.verify();
            ginniAnalyticsMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should update the number of questions asked and unanswered questions',(done)=>{
      var ginniAnalyticsMock = sinon.mock(new GinniAnalytics({_id: '888001234', queriesAsked: 2, unanswered: 1}));
      var ginniAnalyticsObj = ginniAnalyticsMock.object;
      var expectedResult = {status: true};
      ginniAnalyticsMock.expects('update').yields(null, expectedResult);
      ginniAnalyticsObj.update(function(err,result){
        ginniAnalyticsMock.verify();
        ginniAnalyticsMock.restore();
        expect(result.status).to.be.true;
        done();
      });
});

it('should not update the number of questions asked and unanswered questions',(done)=>{
      var ginniAnalyticsMock = sinon.mock(new GinniAnalytics({_id:'888004321', queriesAsked: 1, unanswered: 1}));
      var ginniAnalyticsObj = ginniAnalyticsMock.object;
      var expectedResult = {status: false};
      ginniAnalyticsMock.expects('update').yields(expectedResult, null);
      ginniAnalyticsObj.update(function(err,result){
        ginniAnalyticsMock.verify();
        ginniAnalyticsMock.restore();
        expect(err.status).to.not.be.true;
        done();
      });
});

it('should delete the questions asked and unanswered questions',(done)=>{
  var ginniAnalyticsMock = sinon.mock(GinniAnalytics);
  var expectedResult = {status:true};

  ginniAnalyticsMock.expects('remove').yields(null, expectedResult);
  GinniAnalytics.remove(function(err,result){
    ginniAnalyticsMock.verify();
    ginniAnalyticsMock.restore();
    expect(result.status).to.be.true;
    done();
  });
});

it('should not delete the questions asked and unanswered questions',(done)=>{
  var ginniAnalyticsMock = sinon.mock(GinniAnalytics);
  var expectedResult = {status:false };

  ginniAnalyticsMock.expects('remove').yields(expectedResult, null);
  GinniAnalytics.remove(function(err,result){
    ginniAnalyticsMock.verify();
    ginniAnalyticsMock.restore();
    expect(err.status).to.be.false;
    done();
  });
});


});
