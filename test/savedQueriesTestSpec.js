/* @navinprasad: test cases for saved queries*/
let should = require('chai').should();
let supertest = require('supertest');
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let app = require("./../webserver/service.js");
let SavedQueries = require('./../webserver/models/savedqueries.js');
let url = supertest('http://192.168.1.55:8081/');


describe('Saved Queries', () => {

    it('should save the queries', (done) => {
        var savedQueriesMock = sinon.mock(new SavedQueries({email: 'navin0808@hotmail.com',
         savedquery: [{question: 'Define Abstract Factory in design pattern', answer: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.', type: '19/03/17'}] }));
        var savedQueriesObj = savedQueriesMock.object;
        var expectedResult = {
            status: true
        };
        savedQueriesMock.expects('save').yields(null, expectedResult);
        savedQueriesObj.save(function(err, result) {
            savedQueriesMock.verify();
            savedQueriesMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    it('should not save the queries', (done) => {
        var savedQueriesMock = sinon.mock(new SavedQueries({email: 'navin0808@hotmail.com',
        savedquery: [{question: 'Define Abstract Factory in design pattern', answer: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.', type: '19/03/17'}]}));
        var savedQueriesObj = savedQueriesMock.object;
        var expectedResult = {
            status: false
        };
        savedQueriesMock.expects('save').yields(expectedResult, null);
        savedQueriesObj.save(function(err, result) {
            savedQueriesMock.verify();
            savedQueriesMock.restore();
            expect(err.status).to.be.false;
            done();
        });
    });

    it('should get the saved queries',(done)=>{
      var savedQueriesMock = sinon.mock(SavedQueries);
      var expectedResult = {status:true};

      savedQueriesMock.expects('find').yields(null, expectedResult);
      SavedQueries.find(function(err,result){
        savedQueriesMock.verify();
        savedQueriesMock.restore();
        expect(result.status).to.be.true;
        done();
      });
  });

  it('should not get the saved queries',(done)=>{
      var savedQueriesMock = sinon.mock(SavedQueries);
      var expectedResult = {status:false };

      savedQueriesMock.expects('find').yields(expectedResult, null);
      SavedQueries.find(function(err,result){
        savedQueriesMock.verify();
        savedQueriesMock.restore();
        expect(err.status).to.be.false;
        done();
      });
  });

//     it('should update the saved queries',(done)=>{
//       var savedQueriesMock = sinon.mock(new SavedQueries({email: 'navin0808@hotmail.com',
//        savedquery: [{question: 'Define Abstract Factory in design pattern', answer: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.', type: '19/03/17'}] }));
//       var savedQueriesObj = savedQueriesMock.object;
//       var expectedResult = {status: true};
//       savedQueriesMock.expects('update').yields(null, expectedResult);
//       savedQueriesObj.update(function(err,result){
//         savedQueriesMock.verify();
//         savedQueriesMock.restore();
//         expect(result.status).to.be.true;
//         done();
//       });
// });
//
// it('should not update the saved queries',(done)=>{
//       var savedQueriesMock = sinon.mock(new SavedQueries({email: 'navin0808@hotmail.com',
//       savedquery: [{question: 'Define Abstract Factory in design pattern', answer: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.', type: '19/03/17'}]}));
//       var savedQueriesObj = savedQueriesMock.object;
//       var expectedResult = {status: false};
//       savedQueriesMock.expects('update').yields(expectedResult, null);
//       savedQueriesObj.update(function(err,result){
//         savedQueriesMock.verify();
//         savedQueriesMock.restore();
//         expect(err.status).to.not.be.true;
//         done();
//       });
// });
});
