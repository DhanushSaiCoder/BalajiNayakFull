const express = require('express');
const router = express.Router();
const { Month, validateMonth, validateDay } = require('../models/Month');
const mongoose = require('mongoose');
const Joi = require('joi');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const months = await Month.find({user: userId})
    res.send(months)
});

//create new month
router.post('/', authenticateToken, async (req, res) => {
    try {


        console.log('Received POST request with body:', req.body);

        const existingMonth = await Month.findOne({ month: req.body.month, year: req.body.year, user: req.user.userId });

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
            days: req.body.days,
            user: req.user.userId
        });

        console.log('Saving month:', month);
        await month.save();
        res.send(month);
    } catch (ex) {
        console.log('Error:', ex.message);
        res.status(500).send('Something failed.');
    }
});

//get day
router.get('/day', authenticateToken, async (req, res) => {
    try {
        console.log('Received GET request with query:', req.query);

        const date = new Date(req.query.date);
        if (isNaN(date.getTime())) {
            return res.status(400).send({
                short: "invalidDate",
                message: "Invalid date format."
            });
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const monthDoc = await Month.findOne({ month, year, user: req.user.userId });
        if (!monthDoc) {
            return res.status(404).send({
                short: "monthNotFound",
                message: "Month not found."
            });
        }

        const day = monthDoc.days.find(day => new Date(day.date).toISOString() === date.toISOString());
        if (!day) {
            return res.status(404).send({
                short: "dayNotFound",
                message: "Day not found."
            });
        }
        if (!req.user || !req.user.userId || !monthDoc.user || req.user.userId.toString() !== monthDoc.user.toString()) {
            return res.status(403).send({
                short: "unauthorized",
                message: "You are not authorized to create a day."
            });
        }

        res.send(day);

    } catch (ex) {
        console.log('Error:', ex.message);
        res.status(500).send('Something failed.');
    }
});

//create new day
router.post('/day', authenticateToken, async (req, res) => {
    // Sample body
    // {
    //     "date": "2023-10-01",
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
    // }

    try {
        console.log('Received POST request with body:', req.body);

        // Validate the day in request body
        const { error } = validateDay(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).send({
                short: "invalidDay",
                message: error.details[0].message
            });
        }

        const dateString = req.body.date;
        if (!dateString) {
            return res.status(400).send({
                short: "missingDate",
                message: "Date is required."
            });
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return res.status(400).send({
                short: "invalidDate",
                message: "Invalid date format."
            });
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        let monthDoc = await Month.findOne({ month, year, user: req.user.userId });

        // if(!monthDoc.user){
        //     res.send({message:'fetched a month document of other user '})
        // }

        // If month document doesn't exist, create one
        if (!monthDoc) {
            monthDoc = new Month({
                month: month,
                year: year,
                user: req.user.userId,
                days: [req.body]
            });
            console.log('Creating new month:', monthDoc);
            console.log(req.user);
            if (req.user) {
                monthDoc.user = req.user.userId;
            } else {
                return res.status(401).send({
                    short: "unauthorized",
                    message: "You are not authorized to create a day."
                });
            }

            await monthDoc.save();
            return res.send(monthDoc);
        }

        console.log('monthDoc', monthDoc);

        // If month document exists, check whether the day already exists, if yes replace the periods array with the new one.
        const dayIndex = monthDoc.days.findIndex(day => new Date(day.date).toISOString() === date.toISOString());
        if (dayIndex !== -1) {
            monthDoc.days[dayIndex] = req.body;
            console.log('After replacing the periods:', monthDoc);
            if (!req.user || !req.user.userId || !monthDoc.user || req.user.userId.toString() !== monthDoc.user.toString()) {
                return res.status(403).send({
                    short: "unauthorized",
                    message: "You are not authorized to create a day."
                });
            }
            await monthDoc.save();
            return res.send(monthDoc);
        }

        monthDoc.days.push(req.body);
        console.log('Saving month:', monthDoc);
        if (!req.user || !req.user.userId || !monthDoc.user || req.user.userId.toString() !== monthDoc.user.toString()) {
            return res.status(403).send({
                short: "unauthorized",
                message: "You are not authorized to create a day."
            });
        }
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