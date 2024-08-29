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
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });

    socket.on('enter_room', (roomName, showRoom) => {
        socket.join(roomName.payload);
        showRoom();

        socket.to(roomName.payload).emit('welcome');
    });

    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => socket.to(room).emit('bye'));
    });

    socket.on('new_message', (roomName, msg, done) => {
        socket.to(roomName).emit('new_message', msg);
        done();
    });
});

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);