const express = require('express');
const router = express.Router();
const { Month, validateMonth, validateDay } = require('../models/Month');
const mongoose = require('mongoose');
const Joi = require('joi');

router.get('/', (req, res) => {
    // const days = await Day.find().sort('date');
    // res.send(days);
    res.send('Hello, from days route!');
});

router.post('/', async (req, res) => {
    try {

        console.log('Received POST request with body:', req.body);

        const existingMonth = await Month.findOne({ month: req.body.month, year: req.body.year });

        if (existingMonth) {
            console.log('Month already exists:', existingMonth);
            return res.status(400).send({
                short: "duplicateMonth",
                message: 'Month already exists for the given year.'
            });
        }


        const { error } = validateMonth(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).send({
                short: "invalidMonth",
                message: error.details[0].message
            });
        }


        const month = new Month({
            month: req.body.month,
            monthName: req.body.monthName,
            year: req.body.year,
            days: req.body.days
        });

        console.log('Saving month:', month);
        await month.save();
        res.send(month);
    } catch (ex) {
        console.log('Error:', ex.message);
        res.status(500).send('Something failed.');
    }
});

router.post('/day', async (req, res) => {
    // Sample body
    // {
    //     "date": "2023-10-01T00:00:00.000Z",
    //     "periods": [
    //         {
    //             "class": 10,
    //             "section": "A",
    //             "isSubstitution": false,
    //             "isLeisure": false
    //         },
    //         {
    //             "class": 11,
    //             "section": "B",
    //             "isSubstitution": true,
    //             "isLeisure": false
    //         }
    //     ]
    // },

    try {

        console.log('Received POST request with body:', req.body);

        const monthDoc = await Month.findOne({ month: req.body.month, year: req.body.year });

        res.send(monthDoc)
        
        if (!monthDoc) {
            //create a new month document...
        }

        // validate the day in request body 
        const { error } = validateDay(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).send({
                short: "invalidDay",
                message: error.details[0].message
            });
        }

    } catch (ex) {
        console.log('Error:', ex.message);
        res.status(500).send('Something failed.');
    }
});

module.exports = router;