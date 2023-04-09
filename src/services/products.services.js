const Products = require("../models/products.models");
const { Op } = require("sequelize");
const Categories = require("../models/category.models");

class ProductsServices {
  static async getAll(category) {
    try {
      const options = category ? 
        {where: [{ stock: { [Op.gt]: 0 }}, 
                {category_id: category}],
        attributes: {exclude: ["category_id"]},
        include: Categories } : 
        {where: { stock: { [Op.gt]: 0 }}, 
        attributes: {exclude: ["category_id"]},  
        include: Categories}
      
      return await Products.findAndCountAll(options);
    } catch (error) {
      throw error;
    }
  }

  static async getOne(id) {
    try {
      return await Products.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      return await Products.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async update(data, id) {
    try {
      return await Products.update(data, {
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductsServices;
