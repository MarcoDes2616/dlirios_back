const UsersServices = require("../services/user.services");
const AuthServices = require("../services/auth.services");
const bcrypt = require("bcrypt");

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = await UsersServices.getUser(email);
    if (!data) {
      return next({
        status: 400,
        message: "Invalid email",
        errorName: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next({
        status: 400,
        message: "The password doesn't match with email user",
        errorName: "Invalid password",
      });
    }

    const token = AuthServices.genToken({ id, username, email });
    data.token = token
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userLogin,
};
