// test-socket.js
const { io } = require("socket.io-client");
const socket = io("https://nemoryai.com", {
  transports: ["websocket"],
});
socket.on("connect", () => console.log("Connected!"));
socket.on("connect_error", (err) => console.log("Error:", err.message));
socket.on("disconnect", (reason) => console.log("Disconnected:", reason));
