// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { app, method, result, params } = context;
    // function that adds user to a single post object
    const addUser = async (post) => {
      const user = await app
        .service("users")
        .get(post.author.toString(), params);
      return {
        ...post,
        author: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          photoUrl: user.photoUrl,
        },
      };
    };
    // In a find method we need to process the entire page
    if (method === "find") {
      // Map all data to include the `user` information
      context.result.data = await Promise.all(result.data.map(addUser));
      return context;
    } else {
      // Otherwise just update the single result
      context.result = await addUser(result);
    }

    return context;
  };
};
