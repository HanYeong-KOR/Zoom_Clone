const socket = new WebSocket(`ws://${window.location.host}`);

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
    console.log("New message : ", message.data);
});

setTimeout(() =>{
    socket.send("hello from the browser!");
}, 5000);