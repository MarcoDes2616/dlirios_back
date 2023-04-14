const UserData = require("../models/userData.models");
const Users = require("../models/users.models");

class UsersServices {
  
  static async create(newUser) {
    try {
      return await Users.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async update(data, id) {
    try {
      await Users.update({data_completed: true}, {where: {id}})
      return await UserData.create(data);

    } catch (error) {
      throw error;
    }
  }
  
  static async getUser(email) {
    try {
      const user = await Users.findOne({
        where: { email },
        include: {
          model: UserData,
          include: {
            exclude: ["user_id"]
          }
        }
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UsersServices;
