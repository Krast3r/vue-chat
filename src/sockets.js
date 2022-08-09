export default (io) => {
    io.on("connection", (socket) => {
        console.log(`A new User Connected ${socket.id}`);

        io.emit("user joined", socket.id);

        socket.on("chat:message", function (message) {
            io.emit("chat:message", message);
        });

        socket.on("user typing", function (message) {
            io.emit("user typing", message);
        });

        socket.on("stopped typing", function (message) {
            io.emit("stopped typing", message);
        });

        socket.on("disconnect", function () {
            console.log(`User left ${socket.id}`);

            socket.broadcast.emit("user left", socket.id);
        })
    })
}