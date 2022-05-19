const Server = require('socket.io').Server
let io;

const socket = (server) => {
    io = new Server(server)
    io.on('connection', function (socket) {
        console.log('user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
    io.use(async (socket, next) => {
    // TODO: check authentication here
        next()
    })
    return io
}
const sendMessage = (message) => {
    // TODO: send message conditionally here
    io.emit('message', message)
}

module.exports = { socket, sendMessage }