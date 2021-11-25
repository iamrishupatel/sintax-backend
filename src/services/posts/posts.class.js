const { Service } = require("feathers-mongoose");
const { BadRequest, Forbidden } = require("@feathersjs/errors");

exports.Posts = class Posts extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    if (data.body || data.photoUrl) {
      data.postedBy = params.user._id;
      return super.create(data, params);
    } else throw new BadRequest("Can't create an empty post");
  }
  async remove(id, params) {
    try {
      const post = await this.app.service("posts").get(id, params);
      // check if `post` is uploaded by the authenticated user
      // if not throw error
      if (post.postedBy._id.toString() === params.user._id.toString()) {
        return super.remove(id, params);
      } else {
        throw new Forbidden(
          "not authorized to delete the post created by other user!"
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
};
