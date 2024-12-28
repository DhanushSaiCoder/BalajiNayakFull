const express = require('express');
const router = express.Router();
const { Month, validateMonth } = require('../models/Month');
const mongoose = require('mongoose');
const Joi = require('joi');

router.get('/', (req, res) => {
    // const days = await Day.find().sort('date');
    // res.send(days);
    res.send('Hello, from days route!');
});

router.post('/', async (req, res) => {
    console.log('Received POST request with body:', req.body);

    const { error } = validateMonth(req.body);
    if (error) {
        console.log('Validation error:', error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    const month = new Month({
        month: req.body.month,
        monthName: req.body.monthName,
        year: req.body.year,
        days: req.body.days
    });

    console.log('Saving month:', month);
    await month.save();
    console.log('Month saved successfully:', month);

    res.send(month);
});



module.exports = router;
