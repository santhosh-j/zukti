/* @navinprasad: test cases for unanswered query*/
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let UnansweredQuery = require('./../webserver/models/unansweredQuery.js');
let url = supertest('http://192.168.1.55:8081/');

describe('Unanswered Query', () => {

    it('should get all the unanswered query', (done) => {
        var unansweredQueryMock = sinon.mock(UnansweredQuery);
        var expectedResult = {
            status: true
        };
        unansweredQueryMock.expects('find').yields(null, expectedResult);
        UnansweredQuery.find(function(err, result) {
            unansweredQueryMock.verify();
            unansweredQueryMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not get the unanswered query ', (done) => {
        var unansweredQueryMock = sinon.mock(UnansweredQuery);
        var expectedResult = {
            status: false
        };
        unansweredQueryMock.expects('find').yields(expectedResult, null);
        UnansweredQuery.find(function(err, result) {
            unansweredQueryMock.verify();
            unansweredQueryMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should save the unanswered query ', (done) => {
      var unansweredQueryMock = sinon.mock(new UnansweredQuery({user: 'raja',
      username: 'raja08',
      question: 'define and differentiate state and props',
      keywords: ['state', 'props'],
      intents: ['define', 'differentiate']}));
        var unansweredQueryObj = unansweredQueryMock.object;
        var expectedResult = {
            status: true
        };
        unansweredQueryMock.expects('save').yields(null, expectedResult);
        unansweredQueryObj.save(function(err, result) {
            unansweredQueryMock.verify();
            unansweredQueryMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not save the unanswered query ', (done) => {
        var unansweredQueryMock = sinon.mock(new UnansweredQuery({user: 'raja',
        username: 'raja08',
        question: 'define and differentiate state and props',
        keywords: ['state', 'props'],
        intents: ['define', 'differentiate']}));
        var unansweredQueryObj = unansweredQueryMock.object;
        var expectedResult = {
            status: false
        };
        unansweredQueryMock.expects('save').yields(expectedResult, null);
        unansweredQueryObj.save(function(err, result) {
            unansweredQueryMock.verify();
            unansweredQueryMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });
});
