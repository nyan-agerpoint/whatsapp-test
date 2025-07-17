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
const ACCESS_TOKEN = 'EAAHgZCGiJQbkBPLVD2iRXWOdsaEeaQZCqwSuZCYveEEVTtSVcPvMAZAmzgyuImxUasaCWKpHm920k5yaOOZBUt3IJy37V352xViFgWUiVWfZA6ZAMutBUTW3aevLhcmZCSUjobd406RagS8ZBNFj2P5P3sEgVs3WGBbm2ZC0X9TSzP7sLJmY1cmUt6diiz3UcRT5H2oBaYPYMg5f7i6tX2btWzWWVlhH6zfGr7Gk4CZAOh5UuDk';

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

      if (senderId && message) {
        console.log('Received WhatsApp message from ${senderId}: ${message}');

        // Respond with a simple echo reply (you can replace this logic with AI or database lookup)
        const payload = {
            messaging_product: 'whatsapp',
            to: senderId,
            type: 'text',
            text: {
                body: 'You said: ${message}',
            },
      };

      try {
          const response = fetch(WHATSAPP_API_URL, {
              method: 'POST',
              headers: {
                  'Authorization': 'Bearer ${ACCESS_TOKEN}',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
          });

          const data = response.json();

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
  console.log('\nListening on port ${port}\n');
});

