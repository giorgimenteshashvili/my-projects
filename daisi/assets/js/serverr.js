const chalk = require('chalk');
const express = require('express');
const connectMongoDatabase = require('./back/others/connect.mongo.database');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/tables', require('./back/others/Table.router'));

app.post('/tables', async (req, res) => {
  const { name, person, message, tel, date, time } = req.body;
  
  if (!name || !person || !message || !tel || !date || !time) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  try {
    const newMessage = new message({ name, person, message, tel, date, time });
    await newMessage.save();
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error saving message' });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ success: false });
});

app.listen(5006, () => {
  console.log(chalk.bold.yellow('Server started on port 5006'));
  connectMongoDatabase();
});