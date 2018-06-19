const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Job } = require('../models/jobs');

//----GET

router.get('/', (req, res) => {
  try {
    Job.find({}).then(alljobs => {
      res.json({ alljobs })
    })
  } catch (err) {
    res.json({ err })
  }
});

//---POST

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['job', 'company', 'stage', 'status', 'date', 'comp', 'pros', 'cons', 'notes'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Job.create({
    job:req.body.job, 
    company: req.body.company, 
    stage: req.body.stage, 
    status: req.body.status, 
    date: req.body.date, 
    comp: req.body.comp, 
    pros: req.body.pros, 
    cons: req.body.cons, 
    notes: req.body.notes
  })
  .then(job => {
    return res.status(201).json(job.serialize());
  })

});

//---PUT--------------------
router.put('/:id', jsonParser, (req, res) => {
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
    notes: req.body.notes
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