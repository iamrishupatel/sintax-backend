// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { app, result, params } = context;
    if (result.type === "comment") {
      try {
        const post = await app.service("posts").get(result.parentId, params);
        const { comments } = post;
        const myData = {
          comments: comments.filter((comment) => {
            if (comment) {
              return comment._id.toString() !== result._id.toString();
            }
          }),
        };
        await app.service("posts").patch(result.parentId, myData, params);
      } catch (e) {
        console.log(e);
      }
    }
    if (result.type === "reply") {
      try {
        const comment = await app
          .service("comments")
          .get(result.parentId, params);
        const { children } = comment;
        const myData = {
          children: children.filter(
            (child) => child._id.toString() !== result._id.toString()
          ),
        };
        await app.service("comments").patch(result.parentId, myData, params);
      } catch (e) {
        console.log(e);
      }
    }

    return context;
  };
};
