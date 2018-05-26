const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Jobs } = require('../models/jobs');

//----GET

router.get('/', (req, res) => {
    res.json(Jobs.get());
  });

//---POST

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['job', 'company', 'stage', 'status', 'date', 'comp', 'pros', 'cons', 'notes'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
    const item = Jobs.create(req.body.job, req.body.company, req.body.stage, req.body.status, req.body.date, req.body.comp, req.body.pros, req.body.cons, req.body.notes);
    res.status(201).json(item);
  });

//---PUT

//---DELETE


module.exports = router;