const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
if (!BOT_TOKEN || !CHAT_ID) {
  console.error('Error: BOT_TOKEN and CHAT_ID must be set in .env file.');
  process.exit(1);
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

const cooldowns = new Map(); // IP -> timestamp

app.use(express.static('public')); // serve frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit', upload.single('proof'), async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  if (cooldowns.has(ip) && now - cooldowns.get(ip) < 5 * 60 * 1000) {
    return res.status(429).json({ error: '⏳ Please wait 5 minutes before submitting again.' });
  }

  const { name, email, type, message } = req.body;
  const file = req.file;

  const text = `
🚨 *New Report Submitted*

👤 *Name:* ${name}
📧 *Email:* ${email}
📝 *Type:* ${type}
🗒 *Message:* ${message}
`;

  try {
    // Send text
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'Markdown'
    });

    // If there's media
    if (file) {
      const form = new FormData();
      form.append('chat_id', CHAT_ID);
      form.append('caption', '📎 Attached Proof');
      form.append('parse_mode', 'Markdown');

      const ext = path.extname(file.originalname).toLowerCase();
      const buffer = file.buffer;
      const blob = Buffer.from(buffer);

      if (ext.match(/\.(jpg|jpeg|png|gif)$/)) {
        form.append('photo', blob, file.originalname);
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
          headers: form.getHeaders()
        });
      } else if (ext.match(/\.(mp4|mov)$/)) {
        form.append('video', blob, file.originalname);
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, form, {
          headers: form.getHeaders()
        });
      } else {
        form.append('document', blob, file.originalname);
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, form, {
          headers: form.getHeaders()
        });
      }
    }

    cooldowns.set(ip, now);
    res.json({ success: true });
  } catch (err) {
    console.error('Telegram API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Something went wrong while sending the report.' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
