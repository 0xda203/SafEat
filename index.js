const express = require("express");
const keys = require("./config/keys");

const bodyParser = require("body-parser");
const passport = require("passport");

const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const expressMongoDb = require('express-mongo-db');

const flash = require('connect-flash');

var app = express();
app.set('env', 'development');

// Access mongodb client from request object
app.use(expressMongoDb(keys.MONGODB_URL));

// Set up static folder
app.use(express.static('./src/assets'));

// Set handlebars as default template engine
app.set("views", "src/views");
app.set("view engine", ".hbs");
app.engine(".hbs", require("./config/handlebars"));

app.use(flash());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

const csrfProtection = csrf({ cookie: true })

app.use(
    cookieSession({
        maxAge: 4 * 60 * 60 * 1000, // Tempo de vida 4 horas 
        keys: [keys.COOKIE_KEY]
    })
);

// rota default
app.get(`/`, async(req, res) => {
    var faq_questions = await req.db.collection('faq_questions').find({}).toArray();
    res.render(`landing`, { layout: null, questions: faq_questions });
});

// Inicializa serviço de autenticação passport
require("./src/services/passport");
app.use(passport.initialize());
app.use(passport.session());

// adminController definirá o comportamento da rota /admin (entende-se localhost:9000/admin)
app.use("/admin", require("./src/controllers/adminController")(app));
app.use("/client", require("./src/controllers/clientController")(app));
app.use("/auth", require('./src/controllers/client/authController.js')(csrfProtection));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => { console.log(`Listening on port`, PORT); })