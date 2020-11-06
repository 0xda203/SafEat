const express = require("express");
const keys = require("./config/keys");

const bodyParser = require("body-parser");
const compression = require("compression");
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');
const expressMongoDb = require('express-mongo-db');
const { ObjectId } = require("mongodb");
const moment = require("moment");

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
app.use(bodyParser.json({ limit: '50mb' }));

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

app.get(`/menu`, async(req, res) => {
    res.render(`main/menu`);
});

app.route('/questionario/:testId').get(async(req, res) => {
    var test = await req.db.collection('tests').findOne({ _id: new ObjectId(req.params.testId) });
    var questions = test.questions;
    var totalWeight = 0,
        points = 0;

    for (let i = 0; i < questions.length; i++) {
        console.log(questions[i]);
        totalWeight += questions[i].weight;
        if (questions[i].answer == 'SIM') points += questions[i].weight;
        else if (questions[i].answer != 'NÃO') {
            if (i == 1) {
                var correct = Math.round(parseFloat(questions[0].answer) * 0.4);
                var resp = parseFloat(questions[i].answer);
                if (resp <= correct) points += questions[i].weight;
                else if (Math.round(parseFloat(questions[0].answer) * 0.41) < resp && resp < Math.round(parseFloat(questions[0].answer) * 0.5)) points += questions[i].weight - 1;
                else if (Math.round(parseFloat(questions[0].answer) * 0.51) < resp && resp < Math.round(parseFloat(questions[0].answer) * 0.6)) points += questions[i].weight - 2;
                else if (Math.round(parseFloat(questions[0].answer) * 0.61) < resp && resp < Math.round(parseFloat(questions[0].answer) * 0.7)) points += questions[i].weight - 3;
                else if (Math.round(parseFloat(questions[0].answer) * 0.71) < resp && resp < Math.round(parseFloat(questions[0].answer) * 0.8)) points += questions[i].weight - 4;
            }
        }
    }

    console.log(points);

    res.render(`main/resultado`, {
        test: test,
        totalWeight: totalWeight,
        points: points,
        percentage: (100 * points) / totalWeight
    });
});

app.route('/questionario').get(async(req, res) => {
    res.render(`main/questionario`, {
        questions: [{
                bgShape: false,
                question: 'Qual a capacidade habitual do estabelecimento?',
                method: 'input', // or VF
                type: 'number',
                illustration: '/img/perguntas/people.png',
                orientation: 'right',
                weight: 2
            },
            {
                bgShape: false,
                question: 'Qual a capacidade ocupada hoje?',
                method: 'input', // or VF
                type: 'number',
                illustration: '/img/perguntas/people.png',
                orientation: 'left',
                weight: 2
            },
            {
                bgShape: true,
                question: 'A distância entre as mesas no seu estabelecimento é de 2 metros?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'right',
                weight: 10
            },
            {
                bgShape: false,
                question: 'A distância entre as cadeiras no seu estabelecimento é de 1 metro?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'left',
                weight: 10
            },
            {
                bgShape: false,
                question: 'Você criou e tem posto em prática uma rotina de testagem de temperatura dos seus funcionários?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'right',
                weight: 10
            },
            {
                bgShape: false,
                question: 'Orienta que nenhum contato direto seja feito entre funcionários e clientes?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'left',
                weight: 10
            },
            {
                bgShape: false,
                question: 'O seu estabelecimento disponibiliza álcool em gel 70% para todos os clientes e funcionários?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'right',
                weight: 10
            },
            {
                bgShape: false,
                question: 'Todos os funcionários utilizam máscaras higienizadas?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'left',
                weight: 10
            },
            {
                bgShape: false,
                question: 'O responsável por manipular itens sujos e higienizá-los tem usado luvas descartáveis e as trocado regularmente?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'right',
                weight: 10
            },
            {
                bgShape: false,
                question: 'As superfícies de toque são sempre higienizadas após cada uso?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'left',
                weight: 10
            },
            {
                bgShape: false,
                question: 'Os banheiros são higienizados no mínimo a cada 2 horas?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'right',
                weight: 10
            },
            {
                bgShape: false,
                question: 'As maquininhas são envelopadas com filme plástico e higienizadas com o álcool em gel 70% após cada uso?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'left',
                weight: 10
            },
            {
                bgShape: false,
                question: 'Há alguma proteção de barreira física ou face shield para atendentes de caixa?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'right',
                weight: 10
            },
            {
                bgShape: false,
                question: 'Há algum funcionário na porta do estabelecimento para checar a temperatura dos clientes antes deles entrarem no estabelecimento?',
                method: 'VF', // or VF
                illustration: '/img/perguntas/people.png',
                orientation: 'left',
                weight: 10
            },
            // {
            //     question: 'A distância entre as cadeiras no seu estabelecimento é de 1 metro?',
            //     method: 'VF', // or VF
            //     illustration: '/img/perguntas/people.png',
            //     weight: 10
            // },
        ]
    });
}).post(async(req, res) => {
    var data = req.body;
    data.date = moment().toISOString();
    data.fdate = moment().format('DD/MM/YYYY [às] HH:mm');
    await req.db.collection('tests').insertOne(data);
    res.send({ success: true, id: data._id.toString() });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => { console.log(`Listening on port`, PORT); })