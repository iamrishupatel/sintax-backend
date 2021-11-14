const { Service } = require("feathers-mongoose");
const { Forbidden } = require("@feathersjs/errors");
const { createClient } = require("pexels");
require("dotenv").config();

exports.Users = class Users extends Service {
  async create(data, params) {
    data.username = data.email.replace(/@.*$/, "");
    data.photoUrl = `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}`;
    const pexelsClient = createClient(process.env.PEXELS_API_KEY);
    const query = "Nature";

    const result = await pexelsClient.photos.search({ query, per_page: 1 });
    if (result.photos.length > 0) {
      data.coverUrl = result.photos[0].src.landscape;
    }
    return super.create(data, params);
  }
  async patch(id, data, params) {
    if (id.toString() === params.user._id.toString()) {
      return super.patch(id, data, params);
    } else {
      throw new Forbidden("not authorized to update other user's information!");
    }
  }
};
