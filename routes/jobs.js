const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Job } = require('../models/jobs');

//----GET

// router.get('/', (req, res) => {
//   res.json(Job.get());
// });

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
  console.log(requiredFields);
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
    satus: req.body.status, 
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

//---PUT

//---DELETE


module.exports = router;