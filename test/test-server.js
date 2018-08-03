// 'use strict';

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../server.js');

// const expect = chai.expect;

// chai.use(chaiHttp);

// describe('index page', function () {
//   it('should exist', function () {
//     return chai.request(app)
//       .get('/')
//       .then(function (res) {
//         expect(res).to.have.status(200);
//       });
//   });
// });


'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');


// this makes the Should and expect syntax available throughout
// this module
const should = chai.should();
const expect = chai.expect;

const { Job } = require('../models/jobs');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

const { User } = require('../models/users')

chai.use(chaiHttp);

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  data from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

const FirstName = "test";
const LastName = "dummy";
const EmailAddress = "testdummy@test.com";
const username = "testDum";
const password = "1234567890";

User.hashPassword(password).then(password => {
  User.create({
    FirstName,
    LastName,
    EmailAddress,
    username,
    password
  });
});

const token = jwt.sign(
  {
    user: {
      username,
      EmailAddress,
      FirstName,
      LastName
    }
  },
  JWT_SECRET,
  {
    algorithm: 'HS256',
    subject: EmailAddress,
    expiresIn: '7d'
});

console.log(token)
// we use the Faker library to automatically create fake docs (wanted to try it out)
// generate placeholder values for Email Address, Password, first name, last name
// and then we insert that data into mongo
function seedJobData() {
  console.info('seeding job data');
  

  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push({

      job: "Software Engineer",
      company: "Google",
      stage: "On Site",
      status: "Active",
      date: "2018-07-06T07:00:00.000Z",
      comp: "900K",
      pros: "Good Job",
      cons: "Hard to work up",
      notes: "Need to send resume"
    });
  }
  // this will return a promise
  return Job.insertMany(seedData);
}

describe('job resource', function () {

  before(function () {
    // return runServer(TEST_DATABASE_URL);
    return runServer(TEST_DATABASE_URL, 9000);

  });

  beforeEach(function () {

    return seedJobData(

    );
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  // beforeEach(function() {
  //   return User.hashPassword(password).then(password =>
  //     User.create({
  //       username,
  //       password,
  //       firstName,
  //       lastName
  //     })
  //   );
  // });

  //------------------------------------TEST GET ENDPOINT-----------------------------------------------
  describe('GET endpoint', function () {

    it('should return all existing jobs', function () {
      let res;
      return chai.request(app)
        .get('/jobs')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);
        })
        .then(count => {
          // console.log(res.body);
          // expect(res.body).to.have.length(count);
        });
    });
  })

    //------------------------------------TEST POST ENDPOINT-----------------------------------------------
    describe('POST endpoint', function createnewJob() {

      it('should create a new job', function () {
        let res;
        let newJob = {
          job: "Software Engineer",
          company: "Google",
          stage: "On Site",
          status: "Active",
          date: "2018-07-06T07:00:00.000Z",
          comp: "900K",
          pros: "Good Job",
          cons: "Hard to work up",
          notes: "Need to send resume"
        }
        return chai.request(app)
          .post('/jobs')
          .set('Authorization', `Bearer ${token}`)
          .send(newJob)
          .then(_res => {
            res = _res;
            console.log(res);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.keys(
              'job', 'company', 'stage', 'status', 'date', 'comp', 'pros', 'cons', 'notes');
            expect(res.body.id).should.not.be.null;
            expect(res.body.job).to.equal(newJob.job);
            expect(res.body.company).to.equal(newJob.company);
            expect(res.body.stage).to.equal(newJob.stage);
            expect(res.body.status).to.equal(newJob.status);
            expect(res.body.date).to.equal(newJob.date);
            expect(res.body.comp).to.equal(newJob.comp);
            expect(res.body.pros).to.equal(newJob.pros);
            expect(res.body.cons).to.equal(newJob.cons);
            expect(res.body.notes).to.equal(newJob.notes);
            return Job.findById(res.body.id);
          })
          .then(job => {
            console.log('this is job', job);
            console.log('this is new job', newJob);

            expect(job.id).should.not.be.null;
            expect(job.job).to.equal(newJob.job);
            expect(job.company).to.equal(newJob.company);
            expect(job.stage).to.equal(newJob.stage);
            expect(job.status).to.equal(newJob.status);
            expect(job.date).to.equal(newJob.date);
            expect(job.comp).to.equal(newJob.comp);
            expect(job.pros).to.equal(newJob.pros);
            expect(job.cons).to.equal(newJob.cons);
            expect(job.notes).to.equal(newJob.notes);


          })
      });
    })

  //   //------------------------------------TEST DELETE ENDPOINT-----------------------------------------------

    describe('DELETE endpoint', function () {
      it('delete a job User by id', function () {

        let job;

        return Job
          .findOne()

          .then(function (_job) {
            job = _job;
            return chai.request(app)
              .delete(`/jobs/${job._id}`)
              .set('Authorization', `Bearer ${token}`)


          })
          .then(function (res) {
            expect(res).to.have.status(204);
            return Job.findById(job.id);
          })
          .then(function (job) {
            expect(job).to.be.null;
          });
      });
    });

  // //------------------------------------TEST PUT ENDPOINT-----------------------------------------------


//     describe('PUT endpoint', function () {
//       it('should return job data with right fields updated', function () {
//         // Strategy: It should update a users' account info
//         //
//         let res;
//         const updateJob = {
//           job: "Software Engineer",
//           company: "Google",
//           stage: "On Site",
//           status: "Active",
//           date: "7/1/2018",
//           comp: "900K",
//           pros: "Good Job",
//           cons: "Hard to work up",
//           notes: "Need to send resume"
//         };
        
//         return Job
//           .findOne()
//           .then(function (randomJob) {
//             updateJob.id = randomJob.id;
//             return chai.request(app)
//               .set('Authorization', `Bearer ${token}`)

//               .put(`/logged_in/for_tests/${randomJob.id}`)

//               .send(updateJob);
//           })
//           .then(function (res) {
//             expect(res).to.have.status(204);
//             return User.findById(updateJob.id);
//           })
//           .then(function (job) {
//             expect(job.job).to.equal(newJob.job);
//             expect(job.id).should.not.be.null;
//             expect(job.company).to.equal(newJob.company);
//             expect(job.state).to.equal(newJob.stage);
//             expect(job.status).to.equal(newJob.status);
//             expect(job.date).to.equal(newJob.date);
//             expect(job.comp).to.equal(newJob.comp);
//             expect(job.pros).to.equal(newJob.pros);
//             expect(job.cons).to.equal(newJob.cons);
//             expect(job.notes).to.equal(newJob.notes);
//           })
//       })
//     })
});
