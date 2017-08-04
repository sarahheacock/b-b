//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Page = require('../server/models/page').Page;

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Pages', () => {
  // console.log('Page', Page);
  beforeEach((done) => { //Before each test we empty the database
      Page.remove({}, (err) => {
         console.log('removed');
         done();
      });
  });

  describe('/POST page', () => {
    const page = {
      username: "test",
      password: "password"
    };

    it('it should create a new page with automatic home, about, rooms, localGuide, and adminID', (done) => {
      chai.request(server)
      .post('/page/page-setup')
      .send(page)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');

        res.body.should.have.property('home').be.a('array').lengthOf(1);
        res.body.should.have.property('about').be.a('array').lengthOf(2);
        res.body.should.have.property('rooms').be.a('array').lengthOf(1);
        res.body.should.have.property('localGuide').be.a('array').lengthOf(1);
        res.body.should.have.property('adminID').be.a('string');
        res.body.should.have.property('username').eql(page.username);
        res.body.should.have.property('password');
        done();
      });
    });
  });

  describe('/GET/:id page', () => {
    it('it should return error if page not found', (done) => {
      chai.request(server)
      .get('/page/594952df122ff83a0f190050/')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').eql({message: "Page Not Found"});
        done();
      });
    });

    it('it should GET a page by the given id but only return needed info', (done) => {
      const page = new Page({username: "test", password: "password"});

      page.save((err, page) => {
        chai.request(server)
        .get('/page/' + page.id)
        .send(page)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.not.have.any.keys("_id", "adminID", "username", "password");
          res.body.should.have.property('home').be.a('array').lengthOf(1);
          res.body.should.have.property('about').be.a('array').lengthOf(2);
          res.body.should.have.property('rooms').be.a('array').lengthOf(1);
          res.body.should.have.property('localGuide').be.a('array').lengthOf(1);
          done();
        });
      });
    });
  });

});
