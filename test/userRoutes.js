//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const User = require('../server/models/user').User;

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
      "password": "password",
      "Verify Password": "password"
    };

    const invalidForm = {
      "name": "Sarah",
      "password": "password",
      "Verify Password": "password"
    };

    const invalidPassword = Object.assign({}, user, {password: "pass"});
    const invalidEmail = Object.assign({}, user, {email: "email"});

    it('it should create a new user and login user', (done) => {
      chai.request(server)
      .post('/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.should.have.property('checkout');
        done();
      });
    });

    it('it should return error if name, email, password, and password verification are not supplied', (done) => {
      chai.request(server)
      .post('/user')
      .send(invalidForm)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql({message: "*Fill out required fields."});
        done();
      });
    });

    it('it should return error if passwords do not match', (done) => {
      chai.request(server)
      .post('/user')
      .send(invalidPassword)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql({message: "Passwords do not match."});
        done();
      });
    });

    it('it should return error if invalid email', (done) => {
      chai.request(server)
      .post('/user')
      .send(invalidEmail)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql({message: "Incorrect email input."});
        done();
      });
    });

  });

  describe('/POST login', () => {
    const login = {
      "email": "email@gmail.com",
      "password": "password"
    };

    const invalidForm = {
      "email": "email@gmail.com"
    };

    const invalidUser = {
      "email": "email@gmail",
      "password": "password"
    };

    const invalidPassword = {
      "email": "email@gmail.com",
      "password": "pass"
    };

    let user;
    beforeEach((done) => { //Before each test we empty the database
      user = new User({
        "name": "Sarah",
        "email": "email@gmail.com",
        "password": "password",
        "Verify Password": "password"
      });
      done();
    });

    it('it should return user and checkout property with email and password', (done) => {
      user.save((err, page) => {
        chai.request(server)
        .post('/user/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.should.have.property('checkout');
          done();
        });
      });
    });

    it('it should return fill out required fields', (done) => {
      user.save((err, page) => {
        chai.request(server)
        .post('/user/login')
        .send(invalidForm)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql({message: "*Fill out required fields."});
          done();
        });
      });
    });

    it('it should return no user if not found', (done) => {
      user.save((err, page) => {
        chai.request(server)
        .post('/user/login')
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql({message: 'User not found.'});
          done();
        });
      });
    });

    it('it should return invalid password if wrong', (done) => {
      user.save((err, page) => {
        chai.request(server)
        .post('/user/login')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql({message: 'Incorrect password for given email.'});
          done();
        });
      });
    });
  });

});
