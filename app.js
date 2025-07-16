

// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

const axios = require('axios');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0/759822520538727/messages';
const ACCESS_TOKEN = 'EAAOzeW8yTLkBPHNpZClenGNHFyWDd2YrVPiX4ZCn9NhgMz0EyjRpDIZAnetL2xxWs7FOggFBxTPzjKwQZBSUidJxEpMuhsncvKDoOJHvdlBCZCCxyqbSp09Tn9lKEDJbEcVtZB0PgjTns1yXy4jnQWtAVHKSRomQa28ZA6uL2b645OjWyYyT0wiDhy4Sp7nKtrxKwZDZD';

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Handle incoming messages
app.post('/', (req, res) => {
  const body = req.body;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
  if (message) {
      const senderId = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || 'unknown';

      console.log(`Received message from ${senderId}: ${message}`);

      console.log('Sending reply:', reply);

      // Send reply back via WhatsApp API
      // try {
      //     const response = axios.post(
      //         WHATSAPP_API_URL,
      //         {
      //             messaging_product: 'whatsapp',
      //             to: senderId,
      //             type: 'text',
      //             text: {
      //                 body: `You said: ${message}`
      //             }
      //         },
      //         {
      //             headers: {
      //                 'Authorization': `Bearer ${ACCESS_TOKEN}`,
      //                 'Content-Type': 'application/json'
      //             }
      //         }
      //     );

      //     console.log('Message sent:', response.data);
      //     res.sendStatus(200);
      // } catch (error) {
      //     console.error('Error sending message:', error.response?.data || error.message);
      //     res.sendStatus(500);
      // }
  } else {
      res.sendStatus(400);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});





