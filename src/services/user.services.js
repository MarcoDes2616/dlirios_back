const Users = require("../models/users.models");

class UsersServices {
  
  static async create(newUser) {
    try {
      console.log("llegue aqui");
      return await Users.create(newUser);
    } catch (error) {
      console.log(" y luego llegue aqui");
      throw error;
    }
  }

  static async update(id, data) {
    try {
      return await Users.update(data, {
        where: { id },
      });

    } catch (error) {
      throw error;
    }
  }
  
  static async getUser(email) {
    try {
      const user = await Users.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UsersServices;
