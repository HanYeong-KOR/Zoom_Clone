import express from 'express';
import http from "http";
import SocketIO from "socket.io";

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('socketIO_Home'));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on('connection', (socket) => {
    socket['nickname'] = 'Anon';
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });

    socket.on('enter_room', (roomName, showRoom) => {
        socket.join(roomName.payload);
        showRoom();

        socket.to(roomName.payload).emit('welcome', socket.nickname);
    });

    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => socket.to(room).emit('bye', socket.nickname));
    });

    socket.on('new_message', (roomName, msg, done) => {
        socket.to(roomName).emit('new_message', `${socket.nickname} : ${msg}`);
        done();
    });

    socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);