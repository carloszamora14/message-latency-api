const express = require('express');
const dotenv = require('dotenv');
const mqttService = require('./services/mqtt.service');

dotenv.config();

const app = express();
app.use(express.json());

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
