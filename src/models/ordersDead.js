const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const OrderDeads = db.define('order_deads', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
},
{
  timestamps: false,
});


module.exports = OrderDeads; 