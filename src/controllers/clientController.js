const express = require("express");

// clientRouter é um roteador: trata um grupo de subrotas. Como clientController  designada (e.g /client) 
const clientRouter = express.Router();

// exporta "roteador" clientRouter. module.exports é uma forma de exportar funções para outros arquivos em javascript
module.exports = function(app) {
    // Define um middleware: define uma função que irá processar necessariamente cada uma das requisições
    clientRouter.use((req, res, next) => {
        if (!req.user) return res.status(401).redirect("/auth/signin"); // desvia o usuario para pagina de login caso nao esteja autenticado. está comentado no momento pois a autenticação não está implementada, logo não faz sentido
        /*  Depois de processar, prossegue com requisição normalmente. Se o if acima, porém, for acionado, a instrução return 
            fará com que next() nunca seja acionado, o que não é problema, pois a instrução return vem acompanhada de uma instrução de redirecionamento.
            Um middleware sem next ou alguma instrução de redirecionamento gera erro de timeout */
        res.locals.user = req.user;
        next(); // 
    });

    // Define comportamento da rota default "/" (entenda-se localhost:9000/client)
    clientRouter.get("/", async(req, res) => { // redireciona para /client/questionario/perguntas se o usuario acessar /client
        res.redirect("/client/menu");
    });

    clientRouter.get('/logout', async(req, res) => {
        res.locals.user = null;
        req.logOut();
        res.redirect('/');
    });

    // Define comportamento da rota "/menu" (entenda-se localhost:9000/client/menu)
    clientRouter.get("/menu", async(req, res) => {
        res.render("main/menu", {});
    });

    /*  Incorpora rotas de quizController em /src/controllers/client/quizController.js como subrotas de /client/questionario.*/
    clientRouter.use("/questionario", require('./client/quizController.js'));
    clientRouter.use("/forum", require('./client/forumController.js'));


    return clientRouter;
}