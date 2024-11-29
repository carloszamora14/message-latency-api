const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  arduinoTimestamp: { type: Date, required: true },
  esp32Timestamp: { type: Date, required: true },
  serverTimestamp: { type: Date, required: true },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
