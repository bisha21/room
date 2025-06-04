import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
const app = express();
const server = http.createServer(app);
const io = new Server(server,
    {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        }
    }
);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        console.log("The message that is being sent is: ", data);
        socket.to(data.room).emit("receive_message", data)

    });



    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});