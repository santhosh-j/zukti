/* @navinprasad: test cases for user bookmark */
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let UserBookmarks = require('./../webserver/models/UserBookmarks.js');
let url = supertest('http://localhost:8080/');

describe('Bookmarked messages', () => {

    it('should get the bookmarked messages', (done) => {
        var userBookmarkMock = sinon.mock(UserBookmarks);
        var expectedResult = {
            status: true
        };
        userBookmarkMock.expects('find').yields(null, expectedResult);
        UserBookmarks.find(function(err, result) {
            userBookmarkMock.verify();
            userBookmarkMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not get the bookmarked messages', (done) => {
        var userBookmarkMock = sinon.mock(UserBookmarks);
        var expectedResult = {
            status: false
        };
        userBookmarkMock.expects('find').yields(expectedResult, null);
        UserBookmarks.find(function(err, result) {
            userBookmarkMock.verify();
            userBookmarkMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should save the bookmarked messages', (done) => {
        var userBookmarkMock = sinon.mock(new UserBookmarks({ email: 'navin0808@hotmail.com', bookmarks: [{question: 'define momento pattern', savedResponse: 'Memento pattern is used to restore state of an object to a previous state', responseType: 'text', date: '20/03/17'}]}));
        var userBookmarkObj = userBookmarkMock.object;
        var expectedResult = {
            status: true
        };
        userBookmarkMock.expects('save').yields(null, expectedResult);
        userBookmarkObj.save(function(err, result) {
            userBookmarkMock.verify();
            userBookmarkMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not save the bookmarked messages', (done) => {
      var userBookmarkMock = sinon.mock(new UserBookmarks({  email: 'navin0808@hotmail.com', bookmarks: [{question: 'define momento pattern', savedResponse: 'Memento pattern is used to restore state of an object to a previous state', responseType: 'text', date: '20/03/17'}]}));
        var userBookmarkObj = userBookmarkMock.object;
        var expectedResult = {
            status: false
        };
        userBookmarkMock.expects('save').yields(expectedResult, null);
        userBookmarkObj.save(function(err, result) {
            userBookmarkMock.verify();
            userBookmarkMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should delete the bookmarked messages',(done)=>{
        var userBookmarkMock = sinon.mock(UserBookmarks);
        var expectedResult = {status:true};

        userBookmarkMock.expects('remove').yields(null, expectedResult);
        UserBookmarks.remove(function(err,result){
          userBookmarkMock.verify();
          userBookmarkMock.restore();
          expect(result.status).to.be.true;
          done();
        });
    });

    it('should not delete the bookmarked messages',(done)=>{
        var userBookmarkMock = sinon.mock(UserBookmarks);
        var expectedResult = {status:false};

        userBookmarkMock.expects('remove').yields(expectedResult, null);
        UserBookmarks.remove(function(err,result){
          userBookmarkMock.verify();
          userBookmarkMock.restore();
          expect(err.status).to.not.be.true;
          done();
        });
    });

});
