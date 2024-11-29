const mqtt = require('mqtt');
const dotenv = require('dotenv');

dotenv.config();

const client = mqtt.connect(process.env.MQTT_HOST);

client.on('connect', () => {
  console.log('MQTT connected');
  client.subscribe(process.env.MQTT_TOPIC_SUBSCRIBE, err => {
    if (err) {
      console.error('Failed to subscribe:', err);
    }
  });
});

client.on('message', (topic, message) => {
  if (topic === process.env.MQTT_TOPIC_SUBSCRIBE) {
    try {
      const payload = JSON.parse(message.toString());
      console.log('Received MQTT message:', payload);
    } catch (error) {
      console.error('Invalid JSON:', message.toString());
    }
  }
});

const publishMessage = message => {
  client.publish(process.env.MQTT_TOPIC_PUBLISH, message);
};

module.exports = { client, publishMessage };
