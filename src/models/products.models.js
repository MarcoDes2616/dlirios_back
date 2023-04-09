const { DataTypes } = require("sequelize");
const db = require("../utils/database"); // Reemplaza esto con la configuración de tu instancia de Sequelize

const Products = db.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_image: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
  timestamps: false
});

module.exports = Products;
