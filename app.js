// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0/759822520538727/messages';
const ACCESS_TOKEN = 'EAAHgZCGiJQbkBPC33rVoqoLB3RtodIdTQI4zzik3XFUDFX2zzCZBOZBZAc3moQAyLr0KRNx3ZB1JXQJqVnxVR5x3ZBBmbnVYmz9iBwYFucZBPzaQcWSeJjckP7oZBkMlkhNfV6eyfT9ZAaKsZBEY56EemgAVeSlObJqbfVLnglsc3mmg2buSCuhzSGKO2C0a1KWg9ChYdUlpY0GHZAX8PjliZCEHWCQbZBCoabj6CXZAC0lHKLrSMZD';

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
app.post('/', async (req, res) => {
  const body = req.body;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
  if (message) {
      const senderId = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || 'unknown';

      if (senderId && message) {
        console.log(`Received WhatsApp message from ${senderId}: ${message}`);

        // Respond with a simple echo reply (you can replace this logic with AI or database lookup)
        const payload = {
            messaging_product: 'whatsapp',
            to: senderId,
            type: 'text',
            text: {
                body: `You said: ${message}`,
            },
      };

      try {
          const response = await fetch(WHATSAPP_API_URL, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${ACCESS_TOKEN}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
          });

          console.log(`Response:, ${response}`);

          const data = await response.json();

          if (!response.ok) {
              console.error('Error sending message:', data);
              return res.sendStatus(500);
          }

          console.log('Message sent:', data);
          res.sendStatus(200);
          } catch (err) {
            console.error('Fetch error:', err);
            res.sendStatus(500);
          }
        } else {
          res.sendStatus(400);
        }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});

