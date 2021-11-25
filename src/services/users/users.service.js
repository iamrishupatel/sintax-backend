// Initializes the `users` service on path `/users`
const { Users } = require("./users.class");
const createModel = require("../../models/users.model");
const hooks = require("./users.hooks");
const multer = require("multer");
const mullterMiddleware = multer();

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate"],
  };

  // Initialize our service with any options it requires
  app.use(
    "/users",
    mullterMiddleware.fields([{ name: "photo" }, { name: "cover" }]),
    function (req, res, next) {
      req.feathers.files = req.files;
      next();
    },
    new Users(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("users");

  service.hooks(hooks);
};
