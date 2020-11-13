const express = require("express");
const moment = require("moment");
const ObjectId = require('mongodb').ObjectId;

const quizRouter = express.Router();

quizRouter.get('/perguntas', async(req, res) => {
    var questions = await req.db.collection('questions').find({}).toArray();
    res.render('admin/questionario/perguntas', {
        layout: "admin/admin-template",
        data: questions
    });
});

quizRouter.route('/perguntas/new')
    .get(async(req, res) => {
        var questions = await req.db.collection('questions').find({}).toArray();
        res.render('admin/questionario/novapergunta', { layout: "admin/admin-template", questions: questions });
    }).post(async(req, res) => {
        // insere corpo da requisição diretamente na coleção questions do banco de dados e retorna sucesso
        await req.db.collection('questions').insertOne(req.body);
        res.send({ success: true });
    });


quizRouter.route('/perguntas/edit/:questionId') // parâmetro questionId é acessível através de req.params.questionId
    .get(async(req, res) => {
        var question = await req.db.collection('questions').findOne({ _id: new ObjectId(req.params.questionId) });
        var questions = await req.db.collection('questions').find({}).toArray();
        res.render('admin/questionario/editarpergunta', {
            layout: "admin/admin-template",
            data: question,
            questions: questions
        })
    }).post(async(req, res) => {
        await req.db.collection('questions').updateOne({ _id: new ObjectId(req.params.questionId) }, { $set: req.body });
        res.send({ success: true });
    });

quizRouter.route('/perguntas/delete/:questionId')
    .get(async(req, res) => {
        await req.db.collection('questions').deleteOne({ _id: new ObjectId(req.params.questionId) });
        res.send({ success: true });
    });

module.exports = quizRouter;