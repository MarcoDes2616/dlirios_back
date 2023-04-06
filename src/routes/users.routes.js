const { Router } = require("express");
const Users = require("../models/users.models");
const rolAuth = require("../middlewares/rol.middleware");
const authenticate = require("../middlewares/auth.middleware");
// const { createUserValidator, updateUserValidator } = require("../validators/user.validator");
// const { createUser, updateUser } = require("../controllers/user.controllers");
// const multerUpload = require("../middlewares/upload.middleware")

const router = Router();

router.post("/api/v1/users", 
    // createUserValidator, 
    createUser);

router.put("/api/v1/users/:id", 
    // multerUpload.single('file'), 
    updateUser);

//activar/desactivar un usuario
router.put("/api/v1/user/:id", authenticate, rolAuth, async (req, res) => {
    try {
        const {id} = req.params
        const user = Users.findByPk(id)
        if (user) {
            const {enable} = user
            await Users.update({enable: !enable}, {where: {id}} )
        }
        res.json({
            success: true,
            isActive: !enable
        })
    } catch (error) {
        res.send(error);
    }
});


module.exports = router;