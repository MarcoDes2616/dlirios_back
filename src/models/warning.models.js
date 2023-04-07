const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const Warning = db.define('warning', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  warn: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
},
{
  timestamps: false,
}
);


module.exports = Warning;