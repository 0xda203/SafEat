const passport = require(`passport`);
const express = require(`express`);
const bcrypt = require(`bcrypt`);
const moment = require(`moment`);
const { ObjectId } = require("mongodb");

const authController = express.Router();

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = function(csrfProtection) {

    authController.get("/logout", async(req, res) => {
        if (req.user) {
            req.logOut();
            res.redirect("/auth/signin");
        }
    });

    authController.use(async(req, res, next) => {
        if (req.user)
            return res.redirect(req.user.role == `common` ? '/client/menu' : `/admin/questionario/perguntas`);
        next();
    });

    authController.get('/signin', csrfProtection, async(req, res) => {
        res.render(`main/auth/signin`, {
            layout: null,
            csrfToken: req.csrfToken(),
            error: req.flash('error')[0]
        })
    });

    authController.post('/signin', csrfProtection, async(req, res, next) => {
        passport.authenticate(`local`, {
            successRedirect: `/client/menu`,
            failureRedirect: `/auth/signin`,
            failureFlash: true
        })(req, res, next);
    });

    authController.get('/signup/step1', csrfProtection, async(req, res) => {
        res.render(`main/auth/signup-1`, {
            layout: null,
            csrfToken: req.csrfToken()
        })
    });

    authController.get('/signup/step2', csrfProtection, async(req, res) => {
        if (!req.session.temp) return res.redirect('/signup/step1');
        res.render(`main/auth/signup-2`, {
            layout: null,
            csrfToken: req.csrfToken()
        })
    });

    authController.get('/signup/step3/:clientId', csrfProtection, async(req, res) => {
        res.render(`main/auth/signup-3`, {
            layout: null,
            clientId: req.params.clientId,
            csrfToken: req.csrfToken()
        })
    });

    authController.post('/signup/step1', csrfProtection, async(req, res) => {
        if (req.body.password != req.body.cpassword)
            return res.send({ success: false, message: `As senhas não batem.` });

        var user = await req.db.collection('clients').findOne({
            $or: [
                { email: req.body.email }
            ]
        });

        if (user)
            return res.send({ success: false, message: `Email já cadastrado na base de dados.` });
        else {
            var usuario = {
                username: req.body.username,
                email: req.body.email,
                password: createHash(req.body.password),
            }

            // await req.db.collection(`users`).insertOne(usuario);
            req.session.temp = usuario;
            return res.send({ success: true });
        }

    });

    authController.post('/signup/step2', csrfProtection, async(req, res) => {
        if (!req.session.temp) return res.send({ success: false, message: `Erro. Tente novamente mais tarde.` });

        var user = await req.db.collection('clients').findOne({
            $or: [
                { CNPJ: req.body.CNPJ }
            ]
        });

        if (user)
            return res.send({ success: false, message: `CNPJ já cadastrado na base de dados.` });
        else {
            var obj = req.session.temp;
            obj.companyName = req.body.companyName;
            obj.fantasyName = req.body.fantasyName;
            obj.CNPJ = req.body.CNPJ;

            await req.db.collection('clients').insertOne(obj);
            req.session.temp = null;
            return res.send({ success: true, clientId: obj._id.toString() });
        }

    });

    authController.post('/signup/step3/:clientId', csrfProtection, async(req, res) => {

        var user = await req.db.collection('clients').findOne({
            _id: new ObjectId(req.params.clientId)
        });

        if (!user)
            return res.send({ success: false, message: `Usuário não existente` });
        else {
            delete req.body._csrf;
            req.body.registerDate = moment().format('DD/MM/YYYY');
            req.body.registerDateo = moment().toISOString();
            req.body.role = 'common';

            await req.db.collection('clients').updateOne({
                _id: new ObjectId(req.params.clientId)
            }, { $set: req.body });

            var user = await req.db.collection('clients').findOne({
                _id: new ObjectId(req.params.clientId)
            });

            req.logIn(user, function(error) {
                if (!error) {
                    return res.send({ success: true });
                } else { console.log(error); }
            });

        }

    });
    return authController;
}