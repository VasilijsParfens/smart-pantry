const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/item');
const itemsRouter = require('./routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/items', itemsRouter);

async function startServer() {
  try {
    await sequelize.sync(); // Sync models to DB (creates tables if missing)
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
