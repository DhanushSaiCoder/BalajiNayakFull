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
        // validate the day in request body 
        const { error } = validateDay(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).send({
                short: "invalidDay",
                message: error.details[0].message
            });
        }

        const dateString = req.body.date;
        const date = new Date(dateString);

        const currYear = date.getFullYear();
        const currMonth = date.getMonth() + 1;

        const monthDoc = await Month.findOne({ month: currMonth, year: currYear });


        // if month document doesnt exists, create one
        if (!monthDoc) {
            var newMonthDoc = createMonthDocument();
            newMonthDoc.days.push(req.body);
            console.log('Creating new month:', newMonthDoc);
            await newMonthDoc.save();
            return res.send(newMonthDoc);
        }
        
        console.log('monthDoc', monthDoc)

        // if month document exists, check whether the day already exists, if yes replace the periods array with the new one.
        if (monthDoc.days.length > 0 && monthDoc.days.some(day => new Date(day.date).toISOString() === dateString)) {
            console.log('found the day:', dateString);
            const dayIndex = monthDoc.days.findIndex(day => new Date(day.date).toISOString() === dateString);
            if (dayIndex !== -1) {
                monthDoc.days[dayIndex] = req.body;
                console.log('after replacing the periods:', monthDoc);
                await monthDoc.save();
                return res.send(monthDoc);
            }
        }

        monthDoc.days.push(req.body);
        console.log('Saving month:', monthDoc);
        await monthDoc.save();
        res.send(monthDoc);

    } catch (ex) {
        console.log('Error:', ex.message);
        res.status(500).send('Something failed.');
    }
});

function createMonthDocument() {
    const currentDate = new Date();
    const newMonthDoc = new Month({
        month: currentDate.getMonth() + 1, // getMonth() returns 0-11
        year: currentDate.getFullYear(),
        days: []
    });
    return newMonthDoc;
}
module.exports = router;