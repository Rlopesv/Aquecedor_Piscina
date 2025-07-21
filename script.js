let clienteWeb = null;

const clientId = 'Esp32' + Math.floor(Math.random() * 900) + 100;
clienteWeb = new Paho.MQTT.Client('broker.hivemq.com', 8884, clientId);

const PiscinaPagina = document.getElementById('piscina')
const ColetorPagina = document.getElementById('coletor')
const DiferencaPagina = document.getElementById('diferenca')

clienteWeb.onMessageArrived = function(message) {
    
    const payload = message.payloadString;
    const dados = JSON.parse(payload)
    const TempPiscina=Number(dados.temperatura_piscina).toFixed(2);
    const TempColetor=Number(dados.temperatura_coletor).toFixed(2);
    const TempDiferenca=Number(dados.temperatura_diferenca).toFixed(2);

    PiscinaPagina.textContent = "Piscina "+TempPiscina + ' °C'
    ColetorPagina.innerHTML = "Coletor "+TempColetor + ' °C'
    DiferencaPagina.textContent = "Diferenca "+TempDiferenca + ' °C'
   

     
};

clienteWeb.connect({   
    useSSL: true, 
    onSuccess: function() {
        alert('A conexão com Broker foi bem sucedida')
        clienteWeb.subscribe('piscina/temperatura/enviar');
    },
    onFailure: function() {
        alert('A conexão com Broker falhou')
    }
});

