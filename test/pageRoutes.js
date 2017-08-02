//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Page = require('../server/controllers/models/page');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Pages', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     Page.remove({}, (err) => {
    //        done();
    //     });
    // });
/*
  * Test the /GET route
  */
  describe('/GET page', () => {
    it('it should return error if page not found', (done) => {
      chai.request(server)
        .get('/page/594952df122ff83a0f190050/')
        .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('error').eql({message: "Page Not Found"});
          done();
        });
    });
  });

});
