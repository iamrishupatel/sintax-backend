const { authenticate } = require("@feathersjs/authentication").hooks;

const addCommentToParent = require("../../hooks/add-comment-to-parent");
const removeCommentFromParent = require("../../hooks/remove-comment-from-parent");
const populateUser = require("../../hooks/populate-user");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [addCommentToParent(), populateUser()],
    update: [],
    patch: [],
    remove: [removeCommentFromParent()],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
