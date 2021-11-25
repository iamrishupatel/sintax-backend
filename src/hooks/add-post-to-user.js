// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    // this hook adds a `post id` to the authenticated user after the post has been created
    const { app, result, params } = context;
    const addPostToUser = async (post) => {
      const { user } = params;
      const data = {
        posts: [...user.posts, post._id],
      };
      app.service("users").patch(user._id, data, params);
    };

    addPostToUser(result);
    return context;
  };
};
