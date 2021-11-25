// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  // this hook removes  `post id` from the user after the post has been deleted
  return async (context) => {
    const { app, result, params } = context;
    const removePostFromUser = async (post) => {
      const { user } = params;
      const data = {
        posts: user.posts.filter(
          (item) => item.toString() !== post._id.toString()
        ),
      };
      app.service("users").patch(user._id, data, params);
    };
    removePostFromUser(result);
    return context;
  };
};
