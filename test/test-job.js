

// //------------------------------------TEST GET ENDPOINT-----------------------------------------------
describe('GET endpoint', function () {

    it('should return all existing users', function () {
      let res;
      return chai.request(app)
        .get('/users/for_tests')
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.allusers).to.have.length.of.at.least(1);
          return User.count();
        })
        .then(count => {
          expect(res.body.allusers).to.have.length(count);
        });
    });
  })


"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const username = "bbaggins";
const FirstName = "Bilbo";
const LastName = "bbagins";
const { JWT_SECRET } = require("../config");
const token = jwt.sign(
  {
    user: {
      username,
      FirstName,
      LastName
    }
  },
  JWT_SECRET,
  {
    algorithm: "HS256",
    subject: username,
    expiresIn: "7d"
  }
);
const decoded = jwt.decode(token);

chai.should();

should = chai.should();

const { job } = require("../models");
const { User } = require("../users");
const { closeServer, runServer, app } = require("../server");
const { TEST_DATABASE_URL } = require("../config");

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedjobData() {
  console.info("seeding job data");
  const seedData = [];
  for (var i = 1; i <= 10; i++) {
    seedData.push({
      title: faker.lorem.sentence(),
      company: faker.lorem.sentence(),
      category: "body",
      jobLocation: { lat: 45.535536, lng: -122.620915 }
      // user: "124567"
    });
  }
  return job.insertMany(seedData);
}

describe("job API resource", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedjobData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
    it("should return all existing jobs", function() {
      let res;
      return chai
        .request(app)
        .get("/jobs")
        .set("Authorization", "JWT " + token)
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);
          return job.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
    });

    it("should return jobs with the right fields", function() {
      let resjob;
      return chai
        .request(app)
        .get("/jobs")
        .set("Authorization", "JWT " + token)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.lengthOf.at.least(1);

          res.body.forEach(function(job) {
            job.should.be.a("object");
            job.should.include.keys(
              "id",
              "company",
              "stage",
              "status",
              "date",
              "comp",
              "pros",
              "cons",
              "notes"

            );
          });
          resjob = res.body[0];
          return job.findById(resjob.id);
        })
        .then(job => {
          resjob.title.should.equal(job.title);
          resjob.company.should.equal(job.company);
        });
    });
  });

  describe("POST endpoint", function() {
    it("should add a new job", function() {
      const newjob = {
        title: faker.lorem.sentence(),
        company: faker.lorem.sentence(),
        category: "body",
        jobLocation: { lat: 45.535536, lng: -122.620915 }
      };

      return chai
        .request(app)
        .post("/jobs")
        .set("Authorization", "JWT " + token)
        .send(newjob)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.include.keys(
            "id",
            "job",
            "company",
            "stage",
            "status",
            "date",
            "comp",
            "pros",
            "cons",
            "notes"
          );
          res.body.title.should.equal(newjob.title);
          return job.findById(res.body.id);
        })
        .then(function(job) {
          job.job.should.equal(newjob.job);
          job.company.should.equal(newjob.company);
          job.stage.should.equal(newjob.stage);
          job.status.should.equal(newjob.status);
          job.date.should.equal(newjob.date);
          job.comp.should.equal(newjob.comp);
          job.pros.should.equal(newjob.pros);
          job.cons.should.equal(newjob.cons);
          job.notes.should.equal(newjob.notes);
        });
    });
  });

  describe("DELETE endpoint", function() {
    it("should delete job by id", function() {
      let job;

      return job.findOne()
        .then(_job => {
          job = _job;
          return chai.request(app).delete(`/jobs/${job.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return job.findById(job.id);
        })
        .then(_job => {
          should.not.exist(_job);
        });
    });
  });

  describe("PUT endpoint", function() {
    it("should update fields you send over", function() {
      const updateData = {
        title: "wet dogs",
        company: "google", 
        stage: "TPS", 
        status: "active", 
        date: "9/1/2018", 
        comp: "90k", 
        pros: "wet", 
        cons: "good", 
        notes: "la la"
      };

      return job.findOne()
        .then(job => {
          updateData.id = job.id;

          return chai
            .request(app)
            .put(`/jobs/${job.id}`)
            .send(updateData);
        })
        .then(res => {
          return job.findById(updateData.id);
        })
        .then(job => {
          job.job.should.equal(newjob.job);
          job.company.should.equal(newjob.company);
          job.stage.should.equal(newjob.stage);
          job.status.should.equal(newjob.status);
          job.date.should.equal(newjob.date);
          job.comp.should.equal(newjob.comp);
          job.pros.should.equal(newjob.pros);
          job.cons.should.equal(newjob.cons);
          job.notes.should.equal(newjob.notes);
        });
    });
  });
});


