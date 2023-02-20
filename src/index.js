const express = require("express");
const qrcode = require("qrcode");
const { Client } = require("whatsapp-web.js");

const app = express();
const port = process.env.PORT || 3000;
const client = new Client();

app.get("/", (req, res) => {
    res.send("Hellow world!");
});

app.listen(port);
console.log("Server on port", port);

client.on("qr", (qr) => {
    console.log(qr);
    app.get("/qrcode", async (req, res) => {
        try {
            let qrCodeUrl = await generateQRCode(qr);

            res.send(`<img src="${qrCodeUrl}">`);
        } catch (error) {
            res.status(500).send("Error al generar el código QR");
        }
    });
});

function generateQRCode(text) {
    return new Promise((resolve, reject) => {
        qrcode.toDataURL(text, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
}

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", (message) => {
    if (message.body === "Hola") {
        client.sendMessage(message.from, "Respuesta");
    }
});

client.initialize();
