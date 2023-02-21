const express = require("express");
const QRCode = require("qrcode");
const { Client } = require("whatsapp-web.js");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;
const client = new Client({
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
});
let openaiApiKey = process.env.OPENAI_API_KEY;
let qrReceived = "-";

app.get("/qrcode", async (req, res) => {
    try {
        let qrCodeUrl = await generateQRCode(qrReceived);
        res.send(`<img src="${qrCodeUrl}">`);
    } catch (error) {
        res.status(500).send("Error generating QR code");
    }
});

setInterval(async () => {
    client
        .getState()
        .then((status) => {
            console.log("Status:", status);
        })
        .catch((err) => {
            console.error("Failed to get actual state:", err);
        });
}, 30000);

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

client.initialize();

client.on("qr", (qr) => {
    console.log(qr);
    qrReceived = qr;
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("change_state", (state) => {
    console.log("Chage State:", state);
});

client.on("disconnected", (reason) => {
    console.log("Client is offline:", reason);
    client.initialize();
});

client.on("message_create", async (message) => {
    if (message.fromMe) {
        const params = isCommandAndExtractParams(message.body);
        if (params == undefined) {
            return;
        }

        if (params.command === "/help") {
            client.sendMessage(
                message.from,
                `*Set OPENAI_API_KEY*
                 /key [OPENAI_API_KEY]
                
                 *Consult the official API*
                 /gpt [query]

                *Set API (soon)*
                 /set [number of API]`
            );
            return;
        }

        if (params.command === "/key") {
            openaiApiKey = params.query;
            client.sendMessage(message.from, "registered key");
            return;
        }

        if (params.command === "/gpt") {
            client.sendMessage(
                message.from,
                await consultTheAPIChatGPT(params.query)
            );
        } else {
            client.sendMessage(message.from, "command is invalid");
        }
    }
});

function isCommandAndExtractParams(message) {
    if (message.startsWith("/")) {
        if (message === "/help") {
            return { command: message };
        }

        const endIndex = message.indexOf(" ");
        const params = {
            command: message.substring(0, endIndex),
            query: message.substring(endIndex + 1),
        };

        console.log(params);
        return params;
    }
}

async function consultTheAPIChatGPT(query) {
    const configuration = new Configuration({
        apiKey: openaiApiKey,
    });
    const openai = new OpenAIApi(configuration);
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: query,
            temperature: 0,
            max_tokens: 500,
        });
        console.log(response.data.choices[0]);
        return response.data.choices[0].text;
    } catch (error) {
        console.log(error);
        return "Oops, an error occurred";
    }
}
