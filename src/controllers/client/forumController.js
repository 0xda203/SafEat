const express = require("express");
const moment = require("moment");
const ObjectId = require('mongodb').ObjectId;

const forumRouter = express.Router();

forumRouter.route('/nova-discussao').get(async(req, res) => {
    res.render(`main/forum/novo-post`, {});
}).post(async(req, res) => {
    var data = req.body;
    data.date = moment().toISOString();
    data.fdate = moment().format('DD/MM/YYYY [às] HH:mm');
    await req.db.collection('posts').insertOne(data);
    res.send({ success: true, id: data._id.toString() });
});

module.exports = forumRouter;