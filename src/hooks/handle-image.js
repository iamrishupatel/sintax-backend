// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const { GeneralError } = require("@feathersjs/errors");
const dauria = require("dauria");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { path } = context;
    if (path === "posts") {
      if (!context.data.uri && context.params.file) {
        const file = context.params.file;
        const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
        const uploadedPhoto = await context.app.service("cloudinary").create({
          file: uri,
          folder: "sintax/posts",
        });
        context.data.photo = {
          url: uploadedPhoto.secure_url,
          publicId: uploadedPhoto.public_id,
        };

      }
    }
    return context;
  };
};
