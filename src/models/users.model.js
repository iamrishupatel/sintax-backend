// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
module.exports = function (app) {
  const modelName = "users";
  const mongooseClient = app.get("mongooseClient");
  const schema = new mongooseClient.Schema(
    {
      firstName: {
        type: String,
        required: [true, "first name is required"],
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
        default: " ",
      },
      username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        lowercase: true,
        unique: true,
      },
      photoUrl: {
        type: String,
      },
      coverUrl: {
        type: String,
      },
      about: {
        type: String,
        trim: true,
      },
      posts: [
        {
          type: ObjectId,
          ref: "posts",
        },
      ],
      password: {
        type: String,
        required: [true, "password is required"],
      },
      role: {
        type: String,
        default: "USER",
      },

      email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "email is required"],
      },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
