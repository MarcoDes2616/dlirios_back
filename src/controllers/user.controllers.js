const UsersServices = require("../services/user.services");
const mailWelcome = require("../utils/mail");
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
        html: mailWelcome(user),
      });
    }


    res.status(201).json({
      success: true
    });

  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await UsersServices.update(id, {avatar: req.file?.path});

    res.status(201).json({success: true});
  } catch (error) {
    next(error)
  }
};

module.exports = {
  createUser,
  updateUser,
};
