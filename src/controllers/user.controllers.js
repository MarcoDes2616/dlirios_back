const AuthServices = require("../services/auth.services");
const UsersServices = require("../services/user.services");
const { mailWelcome } = require("../utils/mail");
const transporter = require("../utils/mailer")
require("dotenv").config();


const createUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    
    const user = await UsersServices.create(newUser);
    
    if (user) {
      await transporter.sendMail({
        from: process.env.MAILER_CONFIG_USER,
        to: user.email,
        subject: "Bienvenido a Insumos Dlirios",
        html: mailWelcome(user.username),
      });
    }

    res.status(201).json({
      success: true
    });

  } catch (error) {
    next(error);
  }
};

const createData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {id : user_id, username, email} = req.user;
    if (id != user_id) {
      return next({
        status: 401,
        message: "Unauthorized, user not logged in",
        errorName: "user not logged in",
      });
    }
    const {data_completed} = await UsersServices.getUser(email)
    if (data_completed) {
      console.log("entre");
      return next({
        status: 409,
        message: "Data is completed",
        errorName: "user not logged in",
      });
    }
    
    const {address, phone} = req.body
    const data = {user_id, address, phone, avatar: req.file?.path}
    const result = await UsersServices.update(data, id);
    res.status(201).json({id: user_id, username, email, avatar: result.avatar});
  } catch (error) {
    next(error)
  }
};

const getDataUser = async (req, res, next) => {
  try {
    const {email} = req.user;
    const data = await UsersServices.getUser(email)
    const { id, username, data_completed, enable, user_data } = data;
    
    if (!enable) {
      return next({
        status: 401,
        message: "User diseable",
        errorName: "User diseable",
      });
    }
    
    const token = AuthServices.genToken({ id, username, email });

    res.json({token, id, username, email, data_completed, user_data});

  } catch (error) {
    next(error)
  }
}

module.exports = {
  createUser,
  createData,
  getDataUser
};
