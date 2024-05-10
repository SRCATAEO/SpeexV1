// Conexión al servidor WebSocket
const socket = new WebSocket('ws://localhost:8080');

// Elementos del DOM
const serverList = document.getElementById('server-list');
const createServerBtn = document.getElementById('create-server-btn');
const serverName = document.getElementById('server-name');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Event listener para crear un nuevo servidor
createServerBtn.addEventListener('click', () => {
  const serverName = prompt('Ingresa el nombre del servidor:');
  if (serverName) {
    socket.send(JSON.stringify({ type: 'createServer', name: serverName }));
  }
});

// Event listener para enviar mensajes
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.send(JSON.stringify({ type: 'message', content: message }));
    messageInput.value = '';
  }
});

// Event listener para recibir mensajes del servidor
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'serverList') {
    updateServerList(data.servers);
  } else if (data.type === 'message') {
    displayMessage(data.content);
  }
};

// Función para actualizar la lista de servidores
function updateServerList(servers) {
  serverList.innerHTML = '';
  servers.forEach((server) => {
    const li = document.createElement('li');
    li.textContent = server.name;
    li.addEventListener('click', () => {
      serverName.textContent = server.name;
      socket.send(JSON.stringify({ type: 'joinServer', id: server.id }));
    });
    serverList.appendChild(li);
  });
}

// Función para mostrar un mensaje en el chat
function displayMessage(message) {
  const p = document.createElement('p');
  p.textContent = message;
  chatMessages.appendChild(p);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
