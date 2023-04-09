const { Router } = require("express");
const { addToCart, getCart, updateCart } = require("../controllers/cart.controllers");
const authenticate = require("../middlewares/auth.middleware");
const { addToCartValidator } = require("../validators/cart.validators");
const { update } = require("../services/products.services");

const router = Router();

router.post("/api/v1/cart", 
    addToCartValidator, 
    authenticate, 
    addToCart)

router.put("/api/v1/cart",
    authenticate,
    updateCart)

router.get("/api/v1/cart", 
    authenticate, 
    getCart)


module.exports = router;