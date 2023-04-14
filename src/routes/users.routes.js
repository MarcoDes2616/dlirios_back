const { Router } = require("express");
const Users = require("../models/users.models");
const rolAuth = require("../middlewares/rol.middleware");
const authenticate = require("../middlewares/auth.middleware");
const { createUserValidator } = require("../validators/user.validator");
const { createUser, createData, getDataUser } = require("../controllers/user.controllers");
const multerUpload = require("../middlewares/upload.middleware")

const router = Router();

router.post("/api/v1/users", 
    createUserValidator, 
    createUser);

//user-data
router.post("/api/v1/users/:id",
    authenticate,
    multerUpload.single('file'),
    createData);

//obtener data de usuario por token
router.get("/api/v1/users/",
    authenticate,
    getDataUser);

//activar/desactivar un usuario
router.put("/api/v1/user/:id", authenticate, rolAuth, async (req, res, next) => {
    try {
        const {id} = req.params
        const {id: admin} = req.user
        if (id == admin) {
            return next({
                status: 401,
                errorName: "Unauthorized",
                message: "User Unauthorized",
              });
        }

        const user = await Users.findByPk(id)

        if (user) {
            const {enable} = user
            await Users.update({enable: !enable}, {where: {id}} )
        
        res.json({
            success: true,
            enable: !enable
        })
    }
    } catch (error) {
        next(error);
    }
});


module.exports = router;