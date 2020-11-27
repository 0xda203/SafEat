const express = require("express");
const ObjectId = require('mongodb').ObjectId;

const forumRouter = express.Router();

forumRouter.get('/categorias', async(req, res) => {
    var questions = await req.db.collection('forum_categories').find({}).toArray();
    res.render('admin/forum/categorias', {
        layout: "admin/admin-template",
        data: questions
    });
});

forumRouter.route('/categorias/new')
    .get(async(req, res) => {
        res.render('admin/forum/novacategoria', { layout: "admin/admin-template" });
    }).post(async(req, res) => {
        // insere corpo da requisição diretamente na coleção forum_categories do banco de dados e retorna sucesso
        await req.db.collection('forum_categories').insertOne(req.body);
        res.send({ success: true });
    });


forumRouter.route('/categorias/edit/:categoryId') // parâmetro categoryId é acessível através de req.params.categoryId
    .get(async(req, res) => {
        var question = await req.db.collection('forum_categories').findOne({ _id: new ObjectId(req.params.categoryId) });
        res.render('admin/questionario/editarcategoria', {
            layout: "admin/admin-template",
            data: question
        })
    }).post(async(req, res) => {
        await req.db.collection('forum_categories').updateOne({ _id: new ObjectId(req.params.categoryId) }, { $set: req.body });
        res.send({ success: true });
    });

forumRouter.route('/categorias/delete/:categoryId')
    .get(async(req, res) => {
        await req.db.collection('forum_categories').deleteOne({ _id: new ObjectId(req.params.categoryId) });
        res.send({ success: true });
    });

module.exports = forumRouter;