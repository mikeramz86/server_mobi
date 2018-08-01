// "use strict";
// global.DATABASE_URL = "mongodb://localhost/jwt-auth-demo-test";
// const chai = require("chai");
// const chaiHttp = require("chai-http");

// const { app, runServer, closeServer } = require("../server");
// const { User } = require("../users");

// const expect = chai.expect;

// chai.use(chaiHttp);

// describe("/user", function() {
//   const username = "exampleUser";
//   const password = "examplePass";
//   const FirstName = "Example";
//   const LastName = "User";
 

//   before(function() {
//     return runServer(DATABASE_URL);
//   });

//   after(function() {
//     return closeServer();
//   });

//   beforeEach(function() {});

//   afterEach(function() {
//     return User.remove({});
//   });

//   describe("/users", function() {
//     describe("POST", function() {
//       it("Should reject users with missing username", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             password,
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal("Missing field");
//             expect(res.body.location).to.equal("username");
//           });
//       });
//       it("Should reject users with missing password", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal("Missing field");
//             expect(res.body.location).to.equal("password");
//           });
//       });
//       it("Should reject users with non-string username", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username: 1234,
//             password,
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Incorrect field type: expected string"
//             );
//             expect(res.body.location).to.equal("username");
//           });
//       });
//       it("Should reject users with non-string password", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             password: 1234,
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Incorrect field type: expected string"
//             );
//             expect(res.body.location).to.equal("password");
//           });
//       });
//       it("Should reject users with non-string first name", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             password,
//             FirstName: 1234,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Incorrect field type: expected string"
//             );
//             expect(res.body.location).to.equal("FirstName");
//           });
//       });
//       it("Should reject users with non-string last name", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             password,
//             FirstName,
//             LastName: 1234
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Incorrect field type: expected string"
//             );
//             expect(res.body.location).to.equal("LastName");
//           });
//       });
//       it("Should reject users with non-trimmed username", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username: ` ${username} `,
//             password,
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Cannot start or end with whitespace"
//             );
//             expect(res.body.location).to.equal("username");
//           });
//       });
//       it("Should reject users with non-trimmed password", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             password: ` ${password} `,
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Cannot start or end with whitespace"
//             );
//             expect(res.body.location).to.equal("password");
//           });
//       });
//       it("Should reject users with empty username", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username: "",
//             password,
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Must be at least 1 characters long"
//             );
//             expect(res.body.location).to.equal("username");
//           });
//       });
//       it("Should reject users with password less than seven characters", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             password: "123456",
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Must be at least 7 characters long"
//             );
//             expect(res.body.location).to.equal("password");
//           });
//       });
//       it("Should reject users with password greater than 72 characters", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             password: new Array(73).fill("a").join(""),
//             FirstName,
//             LastName
//           })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal(
//               "Must be at most 72 characters long"
//             );
//             expect(res.body.location).to.equal("password");
//           });
//       });
//       it("Should reject users with duplicate username", function() {
//         // Create an initial user
//         return User.create({
//           username,
//           password,
//           FirstName,
//           LastName
//         })
//           .then(() =>
//             // Try to create a second user with the same username
//             chai
//               .request(app)
//               .post("/users")
//               .send({
//                 username,
//                 password,
//                 FirstName,
//                 LastName
//               })
//           )
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//             expect(res.body.reason).to.equal("ValidationError");
//             expect(res.body.message).to.equal("Username already taken");
//             expect(res.body.location).to.equal("username");
//           });
//       });
//       it("Should create a new user", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             password,
//             FirstName,
//             LastName
//           })
//           .then(res => {
//             expect(res).to.have.status(201);
//             expect(res.body).to.be.an("object");
//             expect(res.body).to.have.keys(
//               "username",
//               "FirstName",
//               "LastName",
//               "id"
//             );
//             expect(res.body.username).to.equal(username);
//             expect(res.body.FirstName).to.equal(FirstName);
//             expect(res.body.LastName).to.equal(LastName);
//             return User.findOne({
//               username
//             });
//           })
//           .then(user => {
//             expect(user).to.not.be.null;
//             expect(user.FirstName).to.equal(FirstName);
//             expect(user.LastName).to.equal(LastName);
//             return user.validatePassword(password);
//           })
//           .then(passwordIsCorrect => {
//             expect(passwordIsCorrect).to.be.true;
//           });
//       });
//       it("Should trim FirstName and LastName", function() {
//         return chai
//           .request(app)
//           .post("/users")
//           .send({
//             username,
//             password,
//             FirstName: ` ${FirstName} `,
//             LastName: ` ${LastName} `
//           })
//           .then(res => {
//             expect(res).to.have.status(201);
//             expect(res.body).to.be.an("object");
//             expect(res.body).to.have.keys(
//               "username",
//               "FirstName",
//               "LastName",
//               "id"
//             );
//             expect(res.body.username).to.equal(username);
//             expect(res.body.FirstName).to.equal(FirstName);
//             expect(res.body.LastName).to.equal(LastName);
//             return User.findOne({
//               username
//             });
//           })
//           .then(user => {
//             expect(user).to.not.be.null;
//             expect(user.FirstName).to.equal(FirstName);
//             expect(user.LastName).to.equal(LastName);
//           });
//       });
//     });
//   });
// });
