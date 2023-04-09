const { Router } = require("express");
const authenticate = require("../middlewares/auth.middleware");
const rolAuth = require("../middlewares/rol.middleware");
const Categories = require("../models/category.models");

const router = Router();

router.post("/api/v1/category", authenticate, rolAuth, async(req, res, next) => {
    try {
        await Categories.create(req.body)
        res.json({
            success: true
        })
    } catch (error) {
        next(error)
    }
})

router.get("/api/v1/category", async(req, res, next) => {
    try {
        const result = await Categories.findAll()
        res.json({
            categories: result
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router