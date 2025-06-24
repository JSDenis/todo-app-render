require('dotenv').config();
const express = require('express');
const todoRoutes = require('./routes/todoRoutes');
const db = require('./db');

const app = express();
app.use(express.json());

db.connect()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Connection error', err.stack));

app.use('/todos', todoRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found!!!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));