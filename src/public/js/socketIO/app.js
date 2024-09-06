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
    const input = room.querySelector('#msg input');
    const value = input.value;
    socket.emit('new_message', roomName, input.value, () => {
        sendMessage(`You : ${value}`);
    });
    input.value = '';
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#name input');
    socket.emit('nickname', input.value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;

    const msgForm = room.querySelector('#msg');
    msgForm.addEventListener('submit', handleMessageSubmit);

    const nameForm = room.querySelector('#name');
    nameForm.addEventListener('submit', handleNicknameSubmit);
}

function sendMessage(message) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}

welcomeForm.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user) => {
    sendMessage(`${user} joined!`);
});

socket.on('bye', (user) => {
    sendMessage(`${user} left T.T`);
})

socket.on('new_message', sendMessage);