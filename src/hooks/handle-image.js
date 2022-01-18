// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const { GeneralError } = require("@feathersjs/errors");
const dauria = require("dauria");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { path, app } = context;

    const uploadImage = async (data) => {
      return await app.service("cloudinary").create(data);
    };
    if (path === "posts") {
      if (!context.data.uri && context.params.file) {
        const file = context.params.file;
        const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
        const uploadedPhoto = await uploadImage({
          file: uri,
          folder: app.get("postFolderPath"),
        });
        context.data.photo = {
          url: uploadedPhoto.secure_url,
          publicId: uploadedPhoto.public_id,
        };
      }
    }

    if (path === "users") {
      if (!context.data.uri && context.params.files) {
        if (context.params.files.photo) {
          const file = context.params.files.photo[0];
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);

          const uploadedPhoto = await uploadImage({
            file: uri,
            folder: app.get("userFolderPath"),
          });
          context.data.photoUrl = uploadedPhoto.secure_url;
        }
        if (context.params.files.cover) {
          const file = context.params.files.cover[0];
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);

          const uploadedPhoto = await uploadImage({
            file: uri,
            folder: app.get("userFolderPath"),
          });
          context.data.coverUrl = uploadedPhoto.secure_url;
        }
      }
    }
    return context;
  };
};
