const users = require("./users/users.service.js");
const posts = require("./posts/posts.service.js");
const cloudinary = require("./cloudinary/cloudinary.service.js");
const communities = require("./communities/communities.service.js");
const comments = require("./comments/comments.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(posts);
  app.configure(cloudinary);
  app.configure(communities);
  app.configure(comments);
};
