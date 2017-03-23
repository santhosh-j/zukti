/* @navinprasad: test cases for user chat history */
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let UserChatHistory = require('./../webserver/models/userChatHistory.js');
let url = supertest('http://localhost:8080/');


describe('User Chat History', () => {

    it('should save the user chat history', (done) => {
        var userChatHistoryMock = sinon.mock(new UserChatHistory({email: 'navin0808@hotmail.com',
      chats: ['what is design pattern']}));
        var userChatHistoryObj = userChatHistoryMock.object;
        var expectedResult = {
            status: true
        };
        userChatHistoryMock.expects('save').yields(null, expectedResult);
        userChatHistoryObj.save(function(err, result) {
            userChatHistoryMock.verify();
            userChatHistoryMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not save the user chat history', (done) => {
        var userChatHistoryMock = sinon.mock(new UserChatHistory({email: 'navin0808@hotmail.com',
         chats: ['what is design pattern']}));
        var userChatHistoryObj = userChatHistoryMock.object;
        var expectedResult = {
            status: false
        };
        userChatHistoryMock.expects('save').yields(expectedResult, null);
        userChatHistoryObj.save(function(err, result) {
            userChatHistoryMock.verify();
            userChatHistoryMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should get the user chat history',(done)=>{
      var userChatHistoryMock = sinon.mock(UserChatHistory);
      var expectedResult = {status:true};

      userChatHistoryMock.expects('find').yields(null, expectedResult);
      UserChatHistory.find(function(err,result){
        userChatHistoryMock.verify();
        userChatHistoryMock.restore();
        expect(result.status).to.be.true;
        done();
      });
  });

  it('should not get the user chat history',(done)=>{
      var userChatHistoryMock = sinon.mock(UserChatHistory);
      var expectedResult = {status:false };

      userChatHistoryMock.expects('find').yields(expectedResult, null);
      UserChatHistory.find(function(err,result){
        userChatHistoryMock.verify();
        userChatHistoryMock.restore();
        expect(err.status).to.be.false;
        done();
      });
  });

    it('should update the user chat history',(done)=>{
      var userChatHistoryMock = sinon.mock(new UserChatHistory({email: 'navin0808@hotmail.com', chats: [{question: 'what is design pattern', answer: 'Design patterns represent the best practices used by experienced object-oriented software developers'},{question: 'define momento pattern', answer : 'Memento pattern is used to restore state of an object to a previous state'}]}));
      var userChatHistoryObj = userChatHistoryMock.object;
      var expectedResult = {status: true};
      userChatHistoryMock.expects('update').yields(null, expectedResult);
      userChatHistoryObj.update(function(err,result){
        userChatHistoryMock.verify();
        userChatHistoryMock.restore();
        expect(result.status).to.be.true;
        done();
      });
});

it('should not update the user chat history',(done)=>{
      var userChatHistoryMock = sinon.mock(new UserChatHistory({email: 'navin0808@hotmail.com', chats: [{question: 'what is design pattern', answer: 'Design patterns represent the best practices used by experienced object-oriented software developers'},{question: 'define momento pattern', answer : 'Memento pattern is used to restore state of an object to a previous state'}]}));
      var userChatHistoryObj = userChatHistoryMock.object;
      var expectedResult = {status: false};
      userChatHistoryMock.expects('update').yields(expectedResult, null);
      userChatHistoryObj.update(function(err,result){
        userChatHistoryMock.verify();
        userChatHistoryMock.restore();
        expect(err.status).to.not.be.true;
        done();
      });
});


});
