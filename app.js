// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0/760721917113358/messages';
const ACCESS_TOKEN = 'EAAHgZCGiJQbkBPLKyinWrCJ9XZCOm7MnicEjrukC1ZAXUJFAZC0n8AiFdJEW2uUIXu2RxGUBy3BpXoV9QZBmHlm8l1oDcxcC3fNTxglsnUnkbTcmZBgoPElrFLYkUEmnIhZAMvsQy6qWdhEUAZB3k0Uyo6f1E1XZArDASP1AsS1XGmLoI1bE5ZBxovEUDk0Fg19S6IpQyUaUWc61ZBB6GHiS9st4W85quZCEBKfjGKWZBO2Vp2OHo';

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

