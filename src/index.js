const express = require("express");
const QRCode = require("qrcode");
const { Client } = require("whatsapp-web.js");

const app = express();
const port = process.env.PORT || 3000;
const client = new Client();
let qrReceived = "-";

app.get("/", (req, res) => {
    res.send("Hellow world!");
});

app.get("/qrcode", async (req, res) => {
    try {
        let qrCodeUrl = await generateQRCode(qrReceived);
        res.send(`<img src="${qrCodeUrl}">`);
    } catch (error) {
        res.status(500).send("Error al generar el código QR");
    }
});

function generateQRCode(text) {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(text, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
}

app.listen(port);
console.log("Server on port", port);

client.on("qr", (qr) => {
    console.log(qr);
    qrReceived = qr;
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message_create", (message) => {
    console.log(message);
    if (message.fromMe && message.body.substring(0, 4) === "/gpt") {
        let query = message.body.substring(5);
        client.sendMessage(message.from, consultTheAPIChatGPT(query));
    }
});

function consultTheAPIChatGPT(query) {
    return "RESPUESTA -> " + query;
}

client.initialize();
