const Users = require("./users.models");
const Products = require("./products.models");
const ProductInOrder = require("./productInOrder.models");
const ProductInCart = require("./productInCart.models");
const Order = require("./order.models");
const Cart = require("./cart.models");
const UserData = require("./userData.models")
const Categories = require("./category.models");
const OrderDeads = require("./ordersDead");
const PioDead = require("./pioDead");

const initModels = () => {

  // users 1 ----- * order
  Users.hasMany(Order, { foreignKey: "user_id" });
  Order.belongsTo(Users, { foreignKey: "user_id" });

  Users.hasMany(OrderDeads, { foreignKey: "user_id" });
  OrderDeads.belongsTo(Users, { foreignKey: "user_id" });

  //Users 1 ------ 1 car
  Users.hasOne(Cart, { foreignKey: "user_id" });
  Cart.belongsTo(Users, { foreignKey: "user_id" });

  //Users 1 ------ 1 car
  Users.hasOne(UserData, { foreignKey: "user_id" });
  UserData.belongsTo(Users, { foreignKey: "user_id" });

  //Users 1 ------ * products
  Categories.hasMany(Products, { foreignKey: "category_id" });
  Products.belongsTo(Categories, { foreignKey: "category_id" });

  //Products 1 ------ * products_in_car
  Products.hasMany(ProductInCart, { foreignKey: "product_id" });
  ProductInCart.belongsTo(Products, { foreignKey: "product_id" });

  //Products 1 ------ * products_in_order
  Products.hasMany(ProductInOrder, { foreignKey: "product_id" });
  ProductInOrder.belongsTo(Products, { foreignKey: "product_id" });

  //car 1 ------ * products_in_car
  Cart.hasMany(ProductInCart, { foreignKey: "cart_id", onDelete: 'cascade' });
  ProductInCart.belongsTo(Cart, { foreignKey: "cart_id" });

  //Order 1 ------ * products_in_order
  Order.hasMany(ProductInOrder, { foreignKey: "order_id", onDelete: 'cascade'});
  ProductInOrder.belongsTo(Order, { foreignKey: "order_id" });

  //Order 1 ------ * products_in_order
  OrderDeads.hasMany(PioDead, { foreignKey: "order_id" });
  PioDead.belongsTo(OrderDeads, { foreignKey: "order_id" });

};

module.exports = initModels;