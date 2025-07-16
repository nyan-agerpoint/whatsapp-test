

// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

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

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});





