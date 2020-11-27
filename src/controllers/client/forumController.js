const express = require("express");
const moment = require("moment");
const ObjectId = require('mongodb').ObjectId;

const forumRouter = express.Router();

forumRouter.route('/').get(async(req, res) => {
    var data = await req.db.collection('forum_posts').find({}).toArray();

    var data = await req.db.collection('forum_posts').aggregate([{
        $addFields: {
            "id": {
                "$toString": "$_id"
            }
        }
    }, {
        $lookup: {
            from: "forum_posts_replies",
            localField: "discussionId'",
            foreignField: "id",
            as: "replies"
        }
    }]).toArray();

    res.render(`main/forum/principal`, {
        data: data
    });
});

forumRouter.route('/discussions/:discussionId').get(async(req, res) => {
    var post = await req.db.collection('forum_posts').findOne({ _id: new ObjectId(req.params.discussionId) });
    var replies = await req.db.collection('forum_posts_replies').find({ discussionId: req.params.discussionId }).toArray();
    res.render(`main/forum/discussion`, {
        postData: post,
        replies: replies
    });
});

forumRouter.route('/discussions/:discussionId/new-reply')
    .post(async(req, res) => {
        req.body.discussionId = req.params.discussionId;
        req.body.date = moment().toISOString();
        req.body.fdate = moment().format('DD/MM/YYYY [às] HH:mm');

        await req.db.collection('forum_posts_replies').insertOne(req.body);

        res.send({
            success: true,
            id: req.body._id.toString()
        });
    });


forumRouter.route('/nova-discussao')
    .get(async(req, res) => {
        var categories = await req.db.collection('forum_categories').find({}).toArray();
        res.render(`main/forum/novo-post`, {
            categories: categories
        });
    }).post(async(req, res) => {
        console.log(req.body);
        var data = req.body;
        data.replies = 0;
        data.date = moment().toISOString();
        data.fdate = moment().format('DD/MM/YYYY [às] HH:mm');
        await req.db.collection('forum_posts').insertOne(data);
        res.send({ success: true });
    });

module.exports = forumRouter;