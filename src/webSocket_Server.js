import express from 'express';
import http from "http";
import WebSocket from 'ws';

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('webSocket_Home'));

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];
wss.on("connection", (socket) => {
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected to Browser ❌"));

    sockets.push(socket);
    socket['nickname'] = 'Anon';
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        console.log('message : ', message);
        console.log('message type : ', message.type);
        

        switch(message.type) {
            case 'message' :
                console.log('2 :', socket['nickname']);
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
                return;
            case 'nickname' :
                console.log('1 :', socket['nickname']);
                socket['nickname'] = message.payload;
                return;
        }
    });
});

server.listen(3000, handleListen);