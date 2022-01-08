// comments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "comments";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      body: { type: String, required: true },
      author: { type: Schema.ObjectId, ref: "users", required: true },
      children: [{ type: Schema.ObjectId, ref: "comments" }],
      parentId: { type: String, required: true },
      type: { type: String, required: true, enum: ["comment", "reply"] },
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
