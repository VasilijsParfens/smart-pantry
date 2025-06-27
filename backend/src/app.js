const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('DB sync error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
