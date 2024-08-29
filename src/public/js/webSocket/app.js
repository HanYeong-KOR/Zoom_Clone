const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector('ul');
const nicknameForm = document.querySelector('#nickname');
const messageForm = document.querySelector('#message');

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

// 방식 1
socket.addEventListener("close", handleSocketClose);
function handleSocketClose() {
    console.log("Disconnected to Server ❌");
}

// 방식 2
socket.addEventListener("message", (message) => {
    const li        = document.createElement("li");
    li.innerText    = message.data;
    messageList.append(li);
});

messageForm.addEventListener("submit", handleSubmit);
function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector('input');
    socket.send(makeMessage('message', input.value));
    input.value = '';
}

nicknameForm.addEventListener("submit", handleNicknameSubmit);
function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = nicknameForm.querySelector('input');
    socket.send(makeMessage('nickname', input.value));
    // input.value = '';
    input.disabled = true;
}

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}