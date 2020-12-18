<br />
<p align="center">
  <img src="/src/assets/img/logo.svg" width="372" height="120" /><br />
</p>
<p align="center">
  🍔 Plataforma para auxiliar bares e restaurantes no município de São Paulo a se adequarem ao protocolo de funcionamento durante a quarentena 🍔
</p>

---

![](platform.gif)

## Começando
SafEat é uma plataforma de apoio que auxilia proprietários de bares e restaurantes no município de São Paulo a realizar a adequação às novas regras de funcionamento vigentes durante a quarentena através de apontamentos personalizados e, assim, de maneira prática, ajudar a diminuir o risco de contaminação dentro do ambiente e a reduzir a possibilidade de interdição por falta de cumprimento das regras.

## Funcionalidades
São três as funcionalidades principais: FAQ, Fórum e Questionário para adequação.

A primeira funcionalidade é uma seção de Perguntas Mais Frequentes, popularmente conhecido como FAQ. Acreditamos que não importa o quão claro e bem-organizado um site esteja, usuários com alguma dúvida provavelmente terão que navegar por algumas páginas em busca da resposta certa, o que pode ser irritante para um visitante que deseja apenas uma resposta rápida para uma pergunta fácil.

![](faq.gif)

Fórum. Acreditamos que fóruns são ferramentas ideais para fornecer à comunidade uma maneira de se conectar. É uma ferramenta que possibilita que as pessoas postem suas perguntas e obtenham respostas de outras pessoas. Não obstante, os fóruns permitem que pessoas troquem pensamentos e conhecimento, o que é importante ser compartilhado nesse momento difícil. 

![](forum.gif)

Finalmente, nosso questionário de adequação. A fim de prover ao usuário sugestões para que seu estabelecimento esteja adequado ao protocolo de funcionamento vigente, dispomos de um questionário que possui um tempo de resposta de aproximadamente 2 minutos, que busca compreender, através de perguntas simples, modeladas à partir da observação do protocolos mais recentes, a atual situação do restaurante, medindo como ele está distante do cenário ideal, para que possamos apresentar posteriormente uma sugestão customizada ao usuário.

![](form.gif)

## Instalação
A instalação completa do SafEat depende de ter o serviço do MongoDB rodando e ter o npm instalado. Rode os seguintes comandos na pasta raíz do projeto para inicializar o SafEat.

```
npm install # instalar dependências
node index.js # rodar a aplicação por padrão na porta 9000
```

## TODO
1. Melhorar linguagem utilizada na aplicação, para parecer menos agressivo ao proprietário quando mostrar os resultados do questionário.
2. Desenvolver termos de uso que devem ser aceitados para uso da aplicação.
3. Desenvolver mecanismo para garantir autenticidade do usuário.
4. Autenticação para painel administrativo.
5. Adicionar configurações de perfil, incluíndo função para alterar visibilidade na tela de comparação de resultados para outros estabelecimentos.