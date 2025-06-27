const express = require('express');
const router = express.Router();
const { Item } = require('../models/item');

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, expirationDate } = req.body;
    const newItem = await Item.create({ name, quantity, expirationDate });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an item by id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Item.destroy({ where: { id } });
    if (deleted === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an item by id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, quantity, expirationDate } = req.body;

    const [updated] = await Item.update(
      { name, quantity, expirationDate },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const updatedItem = await Item.findByPk(id);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
