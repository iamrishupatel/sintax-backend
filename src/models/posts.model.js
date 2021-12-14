// posts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
module.exports = function (app) {
  const modelName = "posts";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      body: {
        type: String,
        trim: true,
      },

      photo: {
        url: String,
        publicId: String,
      },

      likes: [
        {
          type: ObjectId,
          ref: "users",
        },
      ],
      comments: [
        {
          body: {
            type: String,
            required: true,
          },
          createdAt: { type: Date, default: Date.now },
          author: { type: ObjectId, ref: "users", required: true },
        },
      ],
      author: {
        type: ObjectId,
        ref: "users",
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
