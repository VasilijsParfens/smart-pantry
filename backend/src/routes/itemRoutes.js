const express = require('express');
const router = express.Router();
const { Item } = require('../models/item');
const { body, param, validationResult } = require('express-validator');

// Middleware to check validation results
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// GET all items (no changes)
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single item by ID with validation
router.get(
  '/:id',
  param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  validateRequest,
  async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Create a new item with validation
router.post(
  '/',
  [
    body('name').isString().notEmpty().withMessage('Name is required and must be a string'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
    body('expirationDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Expiration date must be a valid ISO8601 date'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, quantity, expirationDate } = req.body;
      const newItem = await Item.create({ name, quantity, expirationDate });
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete an item by id with validation
router.delete(
  '/:id',
  param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  validateRequest,
  async (req, res) => {
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
  }
);

// Update an item by id with validation
router.put(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
    body('name').isString().notEmpty().withMessage('Name is required and must be a string'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
    body('expirationDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Expiration date must be a valid ISO8601 date'),
  ],
  validateRequest,
  async (req, res) => {
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
  }
);

module.exports = router;
