const socket = io();
const welcome = document.getElementById('welcome');
const room = document.getElementById('room');
const welcomeForm = welcome.querySelector('form');
const roomForm = room.querySelector('form');
let roomName;

room.hidden = true;

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector('input');
    socket.emit('enter_room', { payload : input.value }, showRoom);
    roomName = input.value;
    input.value = '';
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
}

function sendMessage(message) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}

welcomeForm.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', () => {
    sendMessage('Someone joined!');
});