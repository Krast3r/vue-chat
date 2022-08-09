const socket = io();

Vue.createApp({
    data() {
        return {
            connectedUsers: [],
            messages: [],
            message: {
                type: "",
                action: "",
                user: "",
                text: "",
                timestamp: ""
            },
            areTyping: [],
            viewChatbox: true
        };
    },

    mounted() {
        this.$refs.inputMessage.focus();

        socket.on("user joined", async (socketId) => {
            const response = await axios.get("/online");

            const sockets = response.data.filter(socket => socket !== socketId);

            this.connectedUsers = sockets;

            const infoMSG = {
                type: "info",
                msg: "User" + socketId + " joined the chat",
            };

            this.messages.push(infoMSG);
        });

        socket.on("chat:message", (message) => this.messages.push(message));
        socket.on("user typing", (username) => this.areTyping.push(username));

        socket.on("stopped typing", (username) => {
            let index = this.areTyping.indexOf(username);
            if (index >= 0) {
                this.areTyping.splice(index, 1);
            }
        });

        socket.on("user left", (socketId) => {
            let index = this.connectedUsers.indexOf(socketId);
            if (index >= 0) {
                this.connectedUsers.splice(index, 1);
            }

            let infoMsg = {
                type: "info",
                msg: "User" + socketId + " has joined",
            };
            this.messages.push(infoMsg);
        });
    },

    methods: {
        send() {
            this.message.type = "chat";
            this.message.user = this.message.user || socket.id;
            this.message.timestamp = moment().calendar();
            socket.emit("chat:message", this.message);

            this.message.type = "";
            this.message.timestamp = "";
            this.message.text = "";
        },
        userIsTyping(username) {
            if (this.areTyping.indexOf(username) >= 0) {
                return true;
            }
            return false;
        },
        usersAreTyping() {
            if (this.areTyping.indexOf(socket.id) <= -1) {
                this.areTyping.push(socket.id);
                socket.emit("user typing", socket.id);
            }
        },
        stoppedTyping(keyCode) {
            if (keyCode == "13" || (keyCode == "8" && this.message.text == "")) {
                let index = this.areTyping.indexOf(socket.id);
                if (index >= 0) {
                    this.areTyping.splice(index, 1);
                    socket.emit("stopped typing", socket.id);
                }
            }
        }
    }
}).mount("#app");