const Users = require("../models/users.models");
const ProductsServices = require("../services/products.services");


const getAllProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const result = await ProductsServices.getAll(category);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {name, description, price, stock, category_id} = req.body
   
    const newData = {
      name,
      description, 
      price: +price, 
      stock: +stock,
      product_image: req.file?.path,
      category_id: +category_id
    }
    await ProductsServices.create(newData);
    res.status(201).json({
      success: true
    });

  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id_product } = req.params;
    const { user_id } = await ProductsServices.getOne(id_product)

    if (user_id != req.user.id) {
      return next({
        status: 401,
        message: "User not logged in. Process with login",
        errorName: "Unauthorized",
      });
    }
    
    await ProductsServices.update(req.body, id_product);
    res.status(204).send({
      success: true
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
};
