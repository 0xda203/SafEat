const express = require("express");
const keys = require("./config/keys");

const bodyParser = require("body-parser");
const compression = require("compression");
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');
const expressMongoDb = require('express-mongo-db');

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

// Allow JSON parsing
app.use(bodyParser.json());

app.use(
    cookieSession({
        maxAge: 4 * 60 * 60 * 1000, // Tempo de vida 4 horas 
        keys: [keys.COOKIE_KEY]
    })
);
// aqui crie uma rota (mudar o que está em laranja)
app.get(`/`, async(req, res) => {
    res.render(`landing`, { layout: null });
});

app.get(`/principal`, async(req, res) => {
    res.render(`principal`, { layout: null });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => { console.log(`Listening on port`, PORT); })