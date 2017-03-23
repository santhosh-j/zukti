var should = require("chai").should(),
assert = require ("chai").assert,
supertest = require("supertest"),
app = require("../../server.js");

var url = supertest("http://192.168.1.55:8081");
let Testing = require('../config/testing');

let log4js = require('log4js');
let logger = log4js.getLogger();

describe("Signup route", function(err){

  it("should handle and login the registered user with correct credentials", function(done){
    url
        .post("/signup")
        .send(Testing.Signup)
        .expect(200)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});
describe("Login route", function(err){

  it("should handle and login the registered user with correct credentials", function(done){
    url
        .post("/login")
        .send(Testing.Login)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});
describe("AdminSignup route", function(err){

  it("should handle and login the registered user with correct credentials", function(done){
    url
        .post("/adminsignup")
        .send(Testing.AdminSignup)
        .expect(200)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
          this.timeout(15000);
  });
});

describe("admindetails route", function(err){

  it("", function(done){
    url
        .post("/admindetails")
        .send(Testing.AdminDetails)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("Check user route", function(err){

  it("should check users", function(done){
    url
        .post("/checkuser")
        .send(Testing.CheckUser)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("Forget Password", function(err){

  it("forget password", function(done){
    url
        .post("/forgetpassword")
        .send(Testing.ForgetPassword)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(200000);
  });
});

describe("Deletes user data", function(err){

  it("should delete user info", function(done){
    url
        .delete("/deleteuser")
        .send(Testing.DeleteUser)
        .expect(200)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("Updates Password", function(err){
  this.timeout(15000);
  it("should update user password", function(done){
    url
        .post("/updatepassword")
        .send(Testing.UpdatePassword)
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          //logger.debug().log("success")
          should.not.exist(err);
          done();
        });
  });
});

describe("Sending mail", function(err){

  it("should send mail", function(done){
    url
        .post("/send")
        .send(Testing.Send)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(50000);
  });
});

describe("Updating Profile", function(err){

  it("should update profile", function(done){
    url
        .put("/updateprofile")
        .send(Testing.UpdateProfile)
        .expect(200)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("Logout", function(err){

  it("should update profile", function(done){
    url
        .get("/signout?id=$2a$08$vBq7dBjR0qQFJIh/83kygeOhxg38Dd.7bdG.OoDiNg/kHDhYqFG8u&email=fashibarveen@gmail.com")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("View Query", function(err){

  it("should view query", function(done){
    url
        .get("/viewquery")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
  });
  this.timeout(50000);
});

describe("Verify", function(err){

  it("should verify", function(done){
    url
        .get("/verify?id=$2a$08$vBq7dBjR0qQFJIh/83kygeOhxg38Dd.7bdG.OoDiNg/kHDhYqFG8u&email=fashibarveen@gmail.com")
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("Analytics", function(err){

  it("", function(done){
    url
        .get("/analytics")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});


describe("Concept", function(err){

  it("", function(done){

    url
        .get("/concept")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("getbroadcastmessage", function(err){

  it("", function(done){
    url
        .get("/getbroadcastmessage")
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("getadminuser", function(err){

  it("", function(done){
    url
        .get("/getadmin")
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("getknowledgebase", function(err){

  it("", function(done){
    url
        .get("/getknowledge")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(100000);
  });
});
describe("verify question", function(err){
this.timeout(15000)
  it("", function(done){
    url
        .post("/question/verifyQuestion")
        .send(Testing.VerifyQuestion)
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
  });
});

describe("add question answer", function(err){

  it("", function(done){
    url
        .post("/question/addQuestionAnswer")
        .send({})
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000);
  });
});

describe("Rate answer", function(err){

  it("", function(done){
    url
        .post("/question/rateAnswer")
        .send(Testing.Rateanswer)
        .expect(302)
        .expect('Content-Type', /text/)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
        this.timeout(15000)
  });
});
