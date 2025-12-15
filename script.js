let clienteWeb = null;

// ===== MQTT =====
const clientId = 'Esp32Web-' + Math.floor(Math.random() * 900 + 100);
clienteWeb = new Paho.MQTT.Client('broker.hivemq.com', 8884, clientId);

// ===== Elementos da UI =====
const PiscinaPagina = document.getElementById('piscina');
const ColetorPagina = document.getElementById('coletor');
const DiferencaPagina = document.getElementById('diferenca');
const StatusPagina = document.getElementById('statusConexao');

const BombaImg = document.getElementById('bomba');
const fluxoIda = document.getElementById('fluxoIda');
const fluxoRetorno = document.getElementById('fluxoRetorno');

// ===== UI OFFLINE =====
function setOfflineUI() {
    PiscinaPagina.textContent = 'Piscina: -- °C';
    ColetorPagina.textContent = 'Coletor: -- °C';
    DiferencaPagina.textContent = 'Diferença de Temperatura: -- °C';

    StatusPagina.textContent = 'Status: Sem conexão WiFi';
    StatusPagina.className = 'status offline';

    BombaImg.src = 'Bomba_desligada.png';
    fluxoIda.style.opacity = 0;
    fluxoRetorno.style.opacity = 0;
}

// ===== UI ONLINE =====
function setOnlineUI(dados) {
    const TempPiscina = Number(dados.temperatura_piscina).toFixed(2);
    const TempColetor = Number(dados.temperatura_coletor).toFixed(2);
    const TempDiferenca = Number(dados.temperatura_diferenca).toFixed(2);

    PiscinaPagina.textContent = `Piscina: ${TempPiscina} °C`;
    ColetorPagina.textContent = `Coletor: ${TempColetor} °C`;
    DiferencaPagina.textContent = `Diferença de Temperatura: ${TempDiferenca} °C`;

    StatusPagina.textContent = 'Status: Conectado';
    StatusPagina.className = 'status online';

    if (dados.circulacao === 1) {
        BombaImg.src = 'Bomba_ligada.png';
        fluxoIda.style.opacity = 1;
        fluxoRetorno.style.opacity = 1;
    } else {
        BombaImg.src = 'Bomba_desligada.png';
        fluxoIda.style.opacity = 0;
        fluxoRetorno.style.opacity = 0;
    }
}

// ===== Mensagem MQTT recebida =====
clienteWeb.onMessageArrived = function (message) {
    try {
        const dados = JSON.parse(message.payloadString);
        console.log(dados)
        setOnlineUI(dados);
    } catch (e) {
        console.error('Erro ao processar mensagem MQTT:', e);
    }
};

// ===== Conexão perdida =====
clienteWeb.onConnectionLost = function (responseObject) {
    if (responseObject.errorCode !== 0) {
        console.warn('Conexão MQTT perdida:', responseObject.errorMessage);
        setOfflineUI();
    }
};

// ===== Conectar MQTT =====
clienteWeb.connect({
    useSSL: true,
    onSuccess: function () {
        console.log('Conectado ao broker MQTT');
        clienteWeb.subscribe('piscina/temperatura/enviar');
    },
    onFailure: function () {
        console.error('Falha na conexão com o broker MQTT');
        setOfflineUI();
    }
});

// ===== Estado inicial seguro =====
setOfflineUI();