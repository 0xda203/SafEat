const express = require("express");
const moment = require("moment");
const ObjectId = require('mongodb').ObjectId;

const quizRouter = express.Router();

function distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344; // km
        return dist;
    }
}

function calc(clientId, db) {
    return new Promise(async(resolve, reject) => {
        var tests = await db.collection('tests').find({ clientId: clientId }).toArray();
        var test = tests[tests.length - 1];
        var questions = test.questions;

        totalWeight = 0,
            points = 0,
            total = 0;

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].ignored) continue;

            total++;
            totalWeight += parseInt(questions[i].weight);

            var question = await db.collection('questions').findOne({ _id: new ObjectId(questions[i]._id) });
            eval(`points += parseInt(${question.function}(questions, i));`); // computa resultado
        }

        return resolve((100 * points) / totalWeight);
    })

}

quizRouter.route('/resultado/:testId')
    .get(async(req, res) => {
        var test = await req.db.collection('tests').findOne({ _id: new ObjectId(req.params.testId) });
        var client = await req.db.collection('clients').findOne({ _id: new ObjectId(test.clientId) });

        var clients = await req.db.collection('clients').find({ _id: { $nin: [new ObjectId(client._id.toString())] } }).toArray();

        var close = [];
        for (let i = 0; i < clients.length; i++) {
            var client2 = clients[i];
            var d = distance(client.position.lat, client.position.lng, client2.position.lat, client2.position.lng);
            client2.distance = d;
            if (d <= 5.0) {
                let pp = await calc(client2._id.toString(), req.db);
                client2.percentage = pp;
                close.push(client2);
            }
        }

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

            var c = Math.abs(p - points);

            if (question.weight != 0 && question.weight != c) wrong.push(question);
            else right.push(question);


        }

        res.render(`main/resultado`, {
            test: test,
            totalWeight: totalWeight,
            points: points,
            close: close,
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
    data.clientId = req.user._id;
    await req.db.collection('tests').insertOne(data);
    res.send({ success: true, id: data._id.toString() });
});

module.exports = quizRouter;