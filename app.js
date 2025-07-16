const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Webhook verification (optional, for platforms like Facebook)
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = 'your_verify_token';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Handle incoming messages
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body && body.message) {
        const senderId = body.senderId || 'unknown';
        const messageText = body.message.text;

        console.log(`Received message from ${senderId}: ${messageText}`);

        // Respond with a simple echo reply (you can replace this logic with AI or database lookup)
        const reply = {
            recipientId: senderId,
            reply: `You said: ${messageText}`,
        };

        console.log('Sending reply:', reply);

        // In real applications, you would send the reply to the platform's API
        res.status(200).json(reply);
    } else {
        res.sendStatus(400);
    }
});


