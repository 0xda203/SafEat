const express = require("express");
const moment = require("moment");
const ObjectId = require('mongodb').ObjectId;

const quizRouter = express.Router();

quizRouter.route('/resultado/:testId')
    .get(async(req, res) => {
        var test = await req.db.collection('tests').findOne({ _id: new ObjectId(req.params.testId) });

        var questions = test.questions,
            totalWeight = 0,
            points = 0,
            total = 0;

        var wrong = [];
        var right = [];

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].ignored) continue;

            total++;
            totalWeight += parseInt(questions[i].weight);

            var question = await req.db.collection('questions').findOne({ _id: new ObjectId(questions[i]._id) });
            let p = points + 0;
            eval(`points += parseInt(${question.function}(questions, i));`); // computa resultado

            var c = p - points;
            if (question.weight != 0 && question.weight != c) wrong.push(question);
            else right.push(question);
        }

        res.render(`main/resultado`, {
            test: test,
            totalWeight: totalWeight,
            points: points,
            percentage: (100 * points) / totalWeight,
            right: right,
            wrong: wrong
        });

    });

quizRouter.route('/responder').get(async(req, res) => {
    var questions = await req.db.collection('questions').find({}).toArray();
    for (let i = 0; i < questions.length; i++) delete questions[i].function;
    res.render(`main/questionario`, {
        questions: questions
    });
}).post(async(req, res) => {
    var data = req.body;
    data.date = moment().toISOString();
    data.fdate = moment().format('DD/MM/YYYY [às] HH:mm');
    await req.db.collection('tests').insertOne(data);
    res.send({ success: true, id: data._id.toString() });
});

module.exports = quizRouter;