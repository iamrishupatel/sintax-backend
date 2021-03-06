// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  /*
   * add author object to any resource which has an author id
   */
  return async (context) => {
    const { app, method, result, params } = context;

    // function that adds user or author to a single resource

    const addUser = async (resource) => {
      const user = await app
        .service("users")
        .get(resource.author.toString(), params);
      return {
        ...resource,
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
