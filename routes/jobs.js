const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Job } = require('../models/jobs');

const localStrategy = require("../auth/index").localStrategy;
const jwtStrategy = require("../auth/index").jwtStrategy;
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });

//----GET

// router.get('/', (req, res) => {
//   try {
//     Job.find({}).then(alljobs => {
//       res.json({ alljobs })
//     })
//   } catch (err) {
//     res.json({ err })
//   }
// });


//--Get Data of User

router.get("/", jwtAuth, (req, res) => {
  Job.find({ userId: req.user.id })
    .then(jobs => {
      res.json(jobs.map(job => job.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something is quite a miss" });
    });
});

// router.get("/:id", (req, res) => {
//   Job.findById(req.params.id)
//   .then(result => {
//     res.json(result.serialize())
//   })
//   .catch(err => {
//      console.error(err);
//      res.status(500).json({ error: "ughhhhhhhh no no" });
//    });
// })

//---POST
//add jwtAuth
router.post('/', jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ['job', 'company', 'stage', 'status', 'date', 'comp', 'pros', 'cons', 'notes'];
  console.log('reqbody',req.body);
  console.log('req user',req.user)
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Job.create({
    job: req.body.job, 
    company: req.body.company, 
    stage: req.body.stage, 
    status: req.body.status, 
    date: req.body.date, 
    comp: req.body.comp, 
    pros: req.body.pros, 
    cons: req.body.cons, 
    notes: req.body.notes,
    userId: req.user.id
  })
  .then(job => {
    return res.status(201).json(job.serialize());
  })

});

//---PUT--------------------
router.put('/:id', jwtAuth, jsonParser,   (req, res) => {
  console.log('is this working');
  const requiredFields = [ 'job', 'company', 'stage', 'status', 'date', 'comp', 'pros', 'cons', 'notes'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    //figure out to do item later
    const message = (
      `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating job with id \`${req.params.id}\``);

  const updatedItem = {
    id: req.params.id,
    job: req.body.job, 
    company: req.body.company, 
    stage: req.body.stage, 
    status: req.body.status, 
    date: req.body.date, 
    comp: req.body.comp, 
    pros: req.body.pros, 
    cons: req.body.cons, 
    notes: req.body.notes,
    userId: req.user.id

  };

  Job.findByIdAndUpdate(req.body.id, updatedItem, { new: true })
  .then(updatedItem => {
    console.log(updatedItem);
    res.status(201).json(updatedItem.serialize())
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: "ughhhhhhhh no no" });
  });
});

//---DELETE

router.delete("/:id", (req, res) => {
  Job.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success, my friend!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});


module.exports = router;


/*

1. Need to connect a user(owner)to a job Every job should have a user
2. Figure out how to save a user to specific job (using different endpoints)  - 
    -every request should pass a jwt 
3. For all other endpoints it should go through auth so the user will only get their jobs and not others


*/