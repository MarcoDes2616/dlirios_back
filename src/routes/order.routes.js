const { Router } = require("express");
const { createOrder, getOrder, getAllOrders} = require("../controllers/order.controllers");
const authenticate = require("../middlewares/auth.middleware");
const rolAuth = require("../middlewares/rol.middleware");

const router = Router();

router.post("/api/v1/order/:user", 
    authenticate, 
    createOrder)

router.get("/api/v1/order", authenticate, getOrder)

router.get("/api/v1/order/all", authenticate, rolAuth, getAllOrders)

module.exports = router;