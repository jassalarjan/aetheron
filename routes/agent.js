// routes/agentRoutes.js
const express = require('express');
const router = express.Router();

let chatDB = {
  text: [],
  nlp: [],
  image: [],
};

router.get('/chats', (req, res) => {
  res.json(chatDB);
});

router.post('/chat', (req, res) => {
  const { message, domain } = req.body;
  chatDB[domain].push({ message });
  res.json({ status: 'created' });
});

router.put('/chat/:domain/:id', (req, res) => {
  const { domain, id } = req.params;
  const { message } = req.body;
  if (chatDB[domain] && chatDB[domain][id]) {
    chatDB[domain][id].message = message;
    return res.json({ status: 'updated' });
  }
  res.status(404).json({ error: 'Chat not found' });
});

router.delete('/chat/:domain/:id', (req, res) => {
  const { domain, id } = req.params;
  if (chatDB[domain] && chatDB[domain][id]) {
    chatDB[domain].splice(id, 1);
    return res.json({ status: 'deleted' });
  }
  res.status(404).json({ error: 'Chat not found' });
});

module.exports = router;
