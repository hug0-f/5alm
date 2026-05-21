import 'dotenv/config';
import express from 'express';
import { connect, isReady, sendMessage } from './whatsapp.js';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ whatsapp: isReady() ? 'connected' : 'not_ready' });
});

app.post('/api/send', async (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'phoneNumber et message requis' });
  }
  if (!isReady()) {
    return res.status(503).json({ error: 'WhatsApp non connecte' });
  }

  try {
    await sendMessage(phoneNumber, message);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.WA_PORT ?? 3001;
app.listen(PORT, () => console.log(`Service WhatsApp sur :${PORT}`));

connect();
