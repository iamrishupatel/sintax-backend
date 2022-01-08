const { Service } = require("feathers-mongoose");

exports.Comments = class Comments extends Service {
  async setup(app) {
    this.app = app;
  }
  async create(data, params) {
    data.author = params.user._id;
    return super.create(data, params);
  }
  async remove(id, params) {
    const comment = await this.app.service("comments").get(id, params);
    if (comment.author.toString() === params.user._id.toString()) {
      return super.remove(id, params);
    } else {
      throw new Error("Not authorized to delete the comment");
    }
  }
};
