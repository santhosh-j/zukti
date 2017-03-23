/* @navinprasad: test cases for broadcast */
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let Broadcast = require('./../webserver/models/broadcast.js');
let url = supertest('http://localhost:8080/');

describe('Broadcast message', () => {

    it('should get all the broadcast message', (done) => {
        var broadcastMock = sinon.mock(Broadcast);
        var expectedResult = {
            status: true
        };
        broadcastMock.expects('find').yields(null, expectedResult);
        Broadcast.find(function(err, result) {
            broadcastMock.verify();
            broadcastMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not get all the broadcast message', (done) => {
        var broadcastMock = sinon.mock(Broadcast);
        var expectedResult = {
            status: false
        };
        broadcastMock.expects('find').yields(expectedResult, null);
        Broadcast.find(function(err, result) {
            broadcastMock.verify();
            broadcastMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should save the broadcast message', (done) => {
        var broadcastMock = sinon.mock(new Broadcast({username: 'navin',value: 'welcome to zukti',
         email: 'navin0808@hotmail.com', date: '19/03/17'}));
        var broadcastmessage = broadcastMock.object;
        var expectedResult = {
            status: true
        };
        broadcastMock.expects('save').yields(null, expectedResult);
        broadcastmessage.save(function(err, result) {
            broadcastMock.verify();
            broadcastMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not save the broadcast message', (done) => {
        var broadcastMock = sinon.mock(new Broadcast({username: 'navin',value: 'welcome to zukti',
         email: 'navin0808@hotmail.com', date: '19/03/17'}));
        var broadcastmessage = broadcastMock.object;
        var expectedResult = {
            status: false
        };
        broadcastMock.expects('save').yields(expectedResult, null);
        broadcastmessage.save(function(err, result) {
            broadcastMock.verify();
            broadcastMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });
});
