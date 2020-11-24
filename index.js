const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');

//Mensaje principal endpoint
app.get('/',(req,res)=>{
    res.send("¡¡En directoo!!")
});


app.post('/',express.json(), (req,res)=>{
    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });

    //funcion mensaje
    function demo(agent){
        agent.add("Enviando respuesta al Wekhook server");
    }

    //funcion mensaje enriquecido
    function customPayloadDemo(agent){
        var payloadData = {
                "richContent": [
                  [
                    {
                      "type": "accordion",
                      "title": "Accordion titulo",
                      "subtitle": "Accordion subtitulo",
                      "image": {
                        "src": {
                          "rawUrl": "https://example.com/images/logo.png"
                        }
                      },
                      "text": "Aqui se pone el texto "
                    }
                  ]
                ] 
        }

        agent.add ( new dfff.Payload(agent.UNSPECIFIED , payloadData,{
           sendAsMessage: true,
           rawPayload: true 
        }))      
    }

    //funcion para traer parametros
    function getQuestion(agent){
      var contexto =  agent.context.get('getQuestion-followup');
      var parametros = req.body.queryResult.parameters;
      console.log(contexto);
      //para entidades
      var afirmativo = parametros.afirmativo;
      //para contextos
      /*var negativo = contexto.parameters.negativo;*/
      agent.context.set({'name': 'getQuestion - yes', 'lifespan': 1, 'parameters': {'afirmativo': afirmativo}});
      agent.add("Todo bien");
    }

    
    var intentMap = new Map();
    //Intent y funcion para interactuar
    intentMap.set('webhookDemo', demo);
    intentMap.set('customPayloadDemo', customPayloadDemo);
    intentMap.set('getQuestion - yes', getQuestion);
    

    //
    agent.handleRequest(intentMap);

})

// ARRANCAMOS EL SERVICIO
const port = 3000;
const dateTime = Date.now();

app.listen(process.env.PORT || port, function () {
  console.log('\x1b[36m'+'------------------------------------------------ ');
  console.log('\x1b[35m'+'          ** Puerto '+(process.env.PORT || port +' activo **'));
  console.log('\x1b[0m'+" [ "+Date()+" ] ");
  console.log(`  Ejemplo escuchando en: ( http://localhost:${port} )`);
  console.log('\x1b[36m'+'------------------------------------------------ ');
  console.log('\x1b[0m');
});
//Correr en nodemon --> npm run dev