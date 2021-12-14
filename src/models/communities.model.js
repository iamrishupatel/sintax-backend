// communities-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "communities";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const { ObjectId } = mongooseClient.Schema;

  const schema = new Schema(
    {
      name: { type: String, required: true, trim: true, maxLength: 48 },
      photoUrl: { type: String },
      description: { type: String, maxLength: 256 },
      messages: [
        {
          createdAt: { type: Date, default: Date.now },
          body: { type: String, required: true },
          author: { type: ObjectId, ref: "users", required: true },
        },
      ],
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
