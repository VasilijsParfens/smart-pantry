const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = { sequelize, Item };
