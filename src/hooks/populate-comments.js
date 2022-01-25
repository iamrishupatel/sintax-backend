// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { app, method, result, params } = context;

    const getAuthor = async (id) => {
      params.query = {
        $select: ["firstName", "lastName", "photoUrl"],
      };
      const author = await app.service("users").get(id.toString(), params);
      /*
        `empty` the query object after the usage in above line
        because we'll be firing other request to comments service
        and above query selects f-name,l-name & photo-url
        which are not present in the comments
        so it breaks everything and children won't be populated
      */
      params.query = {};
      return author;
    };

    const getComment = async (id) => {
      return await app.service("comments").get(id.toString(), params);
    };

    const populateComment = async (commentId) => {
      try {
        if (commentId) {
          const comment = await getComment(commentId);
          comment.author = await getAuthor(comment.author);

          // if chidren > run this func for each of them
          // recursion mylord
          if (comment.children.length > 0) {
            comment.children = await Promise.all(
              comment.children.map(populateComment)
            );
          }
          return comment;
        }
      } catch (error) {
        // TODO: use winston insted
        console.log(error.code);
      }
    };

    if (method === "find") {
      // we will not poplate comments when all post are requested
      return context;
    } else {
      // When only one post is requested by the client
      // we populate every comment using our `populateComment` metod
      result.comments = await Promise.all(result.comments.map(populateComment));
    }

    return context;
  };
};
