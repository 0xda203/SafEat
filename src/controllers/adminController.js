const express = require("express");

// adminRouter é um roteador: trata um grupo de subrotas. Como adminController  designada (e.g /admin) 
const adminRouter = express.Router();

// exporta "roteador" adminRouter. module.exports é uma forma de exportar funções para outros arquivos em javascript
module.exports = function(app) {
    // Define um middleware: define uma função que irá processar necessariamente cada uma das requisições
    adminRouter.use((req, res, next) => {
        // if (!req.user ) return res.status(401).redirect("/auth/signin"); // desvia o usuario para pagina de login caso nao esteja autenticado. está comentado no momento pois a autenticação não está implementada, logo não faz sentido
        /*  Depois de processar, prossegue com requisição normalmente. Se o if acima, porém, for acionado, a instrução return 
            fará com que next() nunca seja acionado, o que não é problema, pois a instrução return vem acompanhada de uma instrução de redirecionamento.
            Um middleware sem next ou alguma instrução de redirecionamento gera erro de timeout */
        next(); // 
    });

    // Define comportamento da rota default "/" (entenda-se localhost:9000/adminm)
    adminRouter.get("/", async(req, res) => { // redireciona para /admin/questionario/perguntas se o usuario acessar /admin
        res.redirect("/admin/questionario/perguntas");
    });

    /*  Incorpora rotas de quizController em /src/controllers/admin/quizController.js como subrotas de /admin/questionario. 
        Assim, a definicao de quizRouter.get('/perguntas', async(req, res) => { ... }); em /src/controllers/admin/quizController.js [linha 7] corresponde, 
        na verdade, à rota /admin/questionario/perguntas (entenda-se localhost:9000/admin/questionario/perguntas)
    */
    adminRouter.use("/questionario", require('./admin/quizController.js'));

    adminRouter.use("/faq", require('./admin/faqController.js'));
    adminRouter.use("/forum", require('./admin/forumController.js'));


    return adminRouter;
}