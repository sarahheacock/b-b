//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Page = require('../server/models/user').User;

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
  // console.log('Page', Page);
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => { done(); });
  });

  describe('/POST user', () => {
    const user = {
      "name": "Sarah",
      "email": "email@gmail.com",
      "phone": "555-555-5555",
      "password": "password",
      "Verify Password": "password"
    };

    const invalidForm = {
      "name": "Sarah",
      "email": "email@gmail.com",
      "phone": "555-555-5555",
    };

    const invalidPassword = Object.assign({}, user, {password: "pass"});
    const invalidEmail = Object.assign({}, user, {email: "email"});
    const invalidPhone = Object.assign({}, user, {phone: "555"});

    it('it should create a new user', (done) => {
      chai.request(server)
      .post('/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');

        done();
      });
    });
  });

});
