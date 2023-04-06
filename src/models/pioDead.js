const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const PioDead = db.define('pio_dead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sub_total: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
},{
  timestamps: false
});

module.exports = PioDead; 