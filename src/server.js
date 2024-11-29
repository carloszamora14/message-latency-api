const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const messageRoutes = require('./routes/message.routes');
const messageController = require('./controllers/message.controller');
const mqttService = require('./services/mqtt.service');

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

app.use('/api', messageRoutes);

mqttService.client.on('message', (topic, message) => {
  if (topic === process.env.MQTT_TOPIC_SUBSCRIBE) {
    try {
      const payload = JSON.parse(message.toString());
      messageController.handleMqttData(payload);
    } catch (error) {
      console.error('Invalid JSON:', message.toString());
    }
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
