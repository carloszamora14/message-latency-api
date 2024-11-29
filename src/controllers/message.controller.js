const Message = require('../models/message.model');
const mqttService = require('../services/mqtt.service');

const getAllMessages = async (req, res) => {
  try {
    const data = await Message.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch data', error: err });
  }
};

const postToMqtt = (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  mqttService.publishMessage(message);
  res.status(200).json({ message: 'Message published to MQTT' });
};

const deleteAllMessages = async (req, res) => {
  try {
    await Message.deleteMany();
    res.status(200).json({ message: 'All messages deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete messages', error: err });
  }
};

const handleMqttData = async payload => {
  const { arduinoTimestamp, esp32Timestamp } = payload;

  if (!arduinoTimestamp || !esp32Timestamp) {
    console.error('Invalid message received');
    return;
  }

  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[+-]\d{4}|Z)$/;;
  if (
    !arduinoTimestamp.match(dateFormat) ||
    !esp32Timestamp.match(dateFormat)
  ) {
    console.log('Invalid date format');
    return;
  }

  const serverTimestamp = new Date();
  const newMessage = new Message({
    arduinoTimestamp: new Date(arduinoTimestamp),
    esp32Timestamp: new Date(esp32Timestamp),
    serverTimestamp,
  });

  try {
    await newMessage.save();
    console.log('Data saved to database');
  } catch (err) {
    console.error('Failed to save data', err);
  }
};

module.exports = {
  getAllMessages,
  postToMqtt,
  deleteAllMessages,
  handleMqttData,
};
