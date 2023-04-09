const { DataTypes } = require("sequelize");
const db = require("../utils/database")


const UserData = db.define('user_datas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  avatar: {
    type: DataTypes.TEXT,
    unique: true
  }
},
{
  timestamps: false
});

module.exports = UserData;
