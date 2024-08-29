const socket = io();
const welcome = document.getElementById('welcome');
const room = document.getElementById('room');
const welcomeForm = welcome.querySelector('form');
let roomName;

room.hidden = true;

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector('input');
    socket.emit('enter_room', { payload : input.value }, showRoom);
    roomName = input.value;
    input.value = '';
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('input');
    const value = input.value;
    socket.emit('new_message', roomName, input.value, () => {
        sendMessage(`You : ${value}`);
    });
    input.value = '';
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;

    const roomForm = room.querySelector('form');
    roomForm.addEventListener('submit', handleMessageSubmit);
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

socket.on('bye', () => {
    sendMessage('Someone left T.T');
})

socket.on('new_message', sendMessage);