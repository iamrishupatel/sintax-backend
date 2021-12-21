const { Service } = require("feathers-mongoose");

exports.Comments = class Comments extends Service {
  async setup(app) {
    this.app = app;
  }
  async create(data, params) {
    data.author = params.user._id;
    data.parentId = params.query.parentId;
    data.type = params.query.type;
    return super.create(data, params);
  }
  async patch(id, data, params) {
    const comment = await this.app.service("comments").get(id, params);
    if (comment.author.toString() === params.user._id.toString()) {
      return super.patch(id, data, params);
    } else {
      throw new Error("Not authorized to edit the comment");
    }
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
