import express from "express";
import morgan from "morgan";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev"));

app.get("/online", (req, res) => {
    console.log([...app.get("io").sockets.adapter.rooms.keys()]);
    res.send([...app.get("io").sockets.adapter.rooms.keys()]);
});

app.use(express.static(join(__dirname, "public")));

export default app;