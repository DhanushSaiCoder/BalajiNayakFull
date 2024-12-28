const mongoose = require('mongoose');
const Joi = require('joi');

const periodSchema = new mongoose.Schema({
    class: { type: Number, required: true },
    section: { type: String, required: true },
    isSubstitution: { type: Boolean, required: true },
    isLeisure: { type: Boolean, required: true },
});

const daySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    periods: [periodSchema],
});

const monthSchema = new mongoose.Schema({
    month: { type: Number, required: true },
    monthName: { type: String, required: true },
    year: { type: Number, required: true },
    days: [daySchema],
});

const Month = mongoose.model('Month', monthSchema);

function validateMonth(month) {
    const schema = Joi.object({
        month: Joi.number().integer().min(1).max(12).required(),
        monthName: Joi.string().required(),
        year: Joi.number().integer().required(),
        days: Joi.array().items(
            Joi.object({
                date: Joi.date().default(() => new Date()),
                periods: Joi.array().items(
                    Joi.object({
                        class: Joi.number().integer().required(),
                        section: Joi.string().required(),
                        isSubstitution: Joi.boolean().required(),
                        isLeisure: Joi.boolean().required(),
                    })
                ).required()
            })
        ).required()
    });

    return schema.validate(month);
}

function validateDay(day) {
    const schema = Joi.object({
        date: Joi.date().required(),
        periods: Joi.array().items(
            Joi.object({
                class: Joi.number().integer().required(),
                section: Joi.string().required(),
                isSubstitution: Joi.boolean().required(),
                isLeisure: Joi.boolean().required(),
            })
        ).required()
    });

    return schema.validate(day);
}

module.exports = {
    Month,
    validateDay,
    validateMonth
};


//-------------- SAMPLE DATA - JSON--------------//

// {
//     "month": 10,
//     "monthName": "October",
//     "year": 2023,
//     "days": [
//         {
//             "date": "2023-10-01T00:00:00.000Z",
//             "periods": [
//                 {
//                     "class": 5,
//                     "section": "A",
//                     "isSubstitution": false,
//                     "isLeisure": false
//                 },
//                 {
//                     "class": 6,
//                     "section": "B",
//                     "isSubstitution": true,
//                     "isLeisure": false
//                 }
//             ]
//         },
//         {
//             "date": "2023-10-02T00:00:00.000Z",
//             "periods": [
//                 {
//                     "class": 7,
//                     "section": "C",
//                     "isSubstitution": false,
//                     "isLeisure": true
//                 }
//             ]
//         }
//     ]
// }