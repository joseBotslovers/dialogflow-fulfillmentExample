const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const nodemailer = require("nodemailer");
const axios = require('axios');

//Mensaje principal endpoint
app.get('/', (req, res) => {
    //res.send("¡¡En directoo!!")
    res.sendFile('index.html', { root: __dirname })

});

app.post('/', express.json(), (req, res) => {

    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });

    //console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    //console.log('Dialogflow Request body: ' + JSON.stringify(req.body));


    //Ejemplo de mensaje simple
    function demo(agent) {
        agent.add("Enviando respuesta al Wekhook server");
    }

    //Ejemplo de mensaje enriquecido
    function customPayloadDemo(agent) {
        var payloadData = {
            "richContent": [
                [{
                    "type": "accordion",
                    "title": "Accordion titulo",
                    "subtitle": "Accordion subtitulo",
                    "image": {
                        "src": {
                            "rawUrl": "https://example.com/images/logo.png"
                        }
                    },
                    "text": "Aqui se pone el texto "
                }]
            ]
        }

        agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, {
            sendAsMessage: true,
            rawPayload: true
        }))
    }

    //Ejemplo de mensajes capturando entidad del intent
    function getQuestionYes(agent) {
        var parametros = req.body.queryResult.parameters;
        console.log("respuesta: " + JSON.stringify(parametros));
        var afirmativo = parametros.afirmativo;
        agent.context.set({ 'name': 'getQuestion - yes', 'lifespan': 1, 'parameters': { 'afirmativo': afirmativo } });
        agent.add("Todo bien");
    }

    function getQuestionNo(agent) {
        var parametros = req.body.queryResult.parameters;
        console.log("respuesta: " + JSON.stringify(parametros));
        var negativo = parametros.negativo;
        agent.context.set({ 'name': 'getQuestion - no', 'lifespan': 1, 'parameters': { 'negativo': negativo } });
        agent.add("Todo mal, Es una pena");
    }

    //Nodemailer

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'jose@botslovers.com',
            pass: '211188-c'
        }
    });

    /*
    function sendEmailHandler(agent) {
        const { email, name } = agent.parameters;
        console.log(email);
        const mailOptions = {
            from: "Jose Franco Nieto", // sender address
            to: email, // list of receivers
            subject: "Email para bots", // Subject line
            html: `<p> hola ${name}. Esto es un email de prueba </p>`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }

            agent.add("Email enviado");
        });

    }
    */

    //Usar Excel como BBDD con sheetDB y axios para las peticiones http

    function saveOrder(agent) {
        const pizza = agent.parameters.Menu;

        /*axios.post('https://sheetdb.io/api/v1/pikq7r2f1d3xu', {
            "data": { "name": pizza, "created_at": Date.now() }
        }).then(res => {
            console.log(res.data);
        });*/

        agent.add(`Okay, tu ` + pizza + ` estara lista en 40 minutos. `);

        /*return axios.get('https://sheetdb.io/api/v1/pikq7r2f1d3xu')
            .then(res => {
                console.log(res.data);
            });
            */

    }

    //-------------------------------
    //Conexion de intent con la funccion con la que van a interactuar
    var intentMap = new Map();
    //Intent y funcion para interactuar
    intentMap.set('webhookDemo', demo);
    intentMap.set('customPayloadDemo', customPayloadDemo);
    intentMap.set('getQuestion - yes', getQuestionYes);
    intentMap.set('getQuestion - no', getQuestionNo);
    //intentMap.set('sendEmail', sendEmailHandler);
    //intentMap.set('Order a pizza', saveOrder);
    //
    agent.handleRequest(intentMap);
})

// ARRANCAMOS EL SERVICIO
const port = 3000;
const dateTime = Date.now();

app.listen(process.env.PORT || port, function() {
    console.log('\x1b[36m' + '------------------------------------------------ ');
    console.log('\x1b[35m' + '          ** Puerto ' + (process.env.PORT || port + ' activo **'));
    console.log('\x1b[0m' + " [ " + Date() + " ] ");
    console.log(`  Ejemplo escuchando en: ( http://localhost:${port} )`);
    console.log('\x1b[36m' + '------------------------------------------------ ');
    console.log('\x1b[0m');
});
//Correr en nodemon --> npm run dev