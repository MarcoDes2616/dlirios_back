const Users = require("../models/users.models");


const rolAuth = async (req, res, next) => {
    const { id } = req.user
    try {
        const data = await Users.findByPk(id)
        const { is_admin } = data;
        if (!is_admin) {
            return next({
                status: 401,
                message: "user unauthorized"
            });
        }
        next();
    } catch (error) {
        res.status(400).json(error);
    }
};

module.exports = rolAuth;