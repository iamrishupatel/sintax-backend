// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    // add comment & replies to their respective parents
    const { app, params, result } = context;
    const { query } = params;
    // check if parent ID is provided
    if (query.parentId === undefined) {
      app.service("comments").remove(result._id, params);
      throw new Error("Please provide a parent Id");
    }

    const parentId = query.parentId.toString();

    if (query.type === "comment") {
      try {
        const post = await app.service("posts").get(parentId, params);
        const { comments } = post;
        const myData = {
          comments: [...comments, result._id],
        };
        app.service("posts").patch(parentId, myData, params);
      } catch (e) {
        // remove comment from db if it was not attached to its parent
        app.service("comments").remove(result._id, params);
        throw new Error("Please provide correct parent Id");
      }
    } else if (query.type === "reply") {
      try {
        const comment = await app.service("comments").get(parentId, params);
        const { children } = comment;

        const myData = {
          children: [...children, result._id],
        };
        app.service("comments").patch(parentId, myData, params);
      } catch (e) {
        // remove comment from db if it was not attached to its parent
        app.service("comments").remove(result._id, params);
        throw new Error("Please provide correct parent Id");
      }
    }
    // in all other case cases
    else {
      // remove comment from db if it was not attached to its parent
      app.service("comments").remove(result._id, params);
      throw new Error("Please provide correct comment Type");
    }
    // console.log(context.result);
    return context;
  };
};
