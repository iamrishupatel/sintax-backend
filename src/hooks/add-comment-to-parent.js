// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    // add comment & replies to their respective parents
    const { app, params, result } = context;

    if (result.type === "comment") {
      try {
        const post = await app.service("posts").get(result.parentId, params);
        const { comments } = post;
        const myData = {
          comments: [...comments, result._id],
        };
        await app.service("posts").patch(result.parentId, myData, params);
      } catch (e) {
        // remove comment from db if it was not attached to its parent
        await app.service("comments").remove(result._id, params);
        throw new Error("Please provide correct parent Id");
      }
    } else if (result.type === "reply") {
      try {
        const comment = await app
          .service("comments")
          .get(result.parentId, params);
        const { children } = comment;

        const myData = {
          children: [...children, result._id],
        };
        await app.service("comments").patch(result.parentId, myData, params);
      } catch (e) {
        // remove comment from db if it was not attached to its parent
        await app.service("comments").remove(result._id, params);
        throw new Error("Please provide correct parent Id");
      }
    }
    // console.log(context.result);
    return context;
  };
};
