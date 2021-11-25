// Initializes the `cloudinary` service on path `/cloudinary`
const { CloudinaryService } = require("./cloudinary.class");
const hooks = require("./cloudinary.hooks");
require("dotenv").config();

module.exports = function (app) {
  const options = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };

  // Initialize our service with any options it requires
  app.use("/cloudinary", new CloudinaryService(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("cloudinary");

  service.hooks(hooks);
};
