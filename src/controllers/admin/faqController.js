const express = require("express");
const ObjectId = require('mongodb').ObjectId;

const faqRouter = express.Router();

faqRouter.get('/perguntas', async(req, res) => {
    var questions = await req.db.collection('faq_questions').find({}).toArray();
    res.render('admin/faq/perguntas', {
        layout: "admin/admin-template",
        data: questions
    });
});

faqRouter.route('/perguntas/new')
    .get(async(req, res) => {
        res.render('admin/faq/novapergunta', { layout: "admin/admin-template" });
    }).post(async(req, res) => {
        // insere corpo da requisição diretamente na coleção faq_questions do banco de dados e retorna sucesso
        await req.db.collection('faq_questions').insertOne(req.body);
        res.send({ success: true });
    });


faqRouter.route('/perguntas/edit/:questionId') // parâmetro questionId é acessível através de req.params.questionId
    .get(async(req, res) => {
        var question = await req.db.collection('faq_questions').findOne({ _id: new ObjectId(req.params.questionId) });
        res.render('admin/questionario/editarpergunta', {
            layout: "admin/admin-template",
            data: question
        })
    }).post(async(req, res) => {
        await req.db.collection('faq_questions').updateOne({ _id: new ObjectId(req.params.questionId) }, { $set: req.body });
        res.send({ success: true });
    });

faqRouter.route('/perguntas/delete/:questionId')
    .get(async(req, res) => {
        await req.db.collection('faq_questions').deleteOne({ _id: new ObjectId(req.params.questionId) });
        res.send({ success: true });
    });

module.exports = faqRouter;