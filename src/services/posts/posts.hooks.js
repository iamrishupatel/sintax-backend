const { authenticate } = require("@feathersjs/authentication").hooks;

const handleImage = require("../../hooks/handle-image");
const addPostToUser = require("../../hooks/add-post-to-user");
const removePostFromUser = require("../../hooks/remove-post-from-user");

const populateUser = require("../../hooks/populate-user");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [handleImage()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [populateUser()],
    find: [],
    get: [],
    create: [addPostToUser()],
    update: [],
    patch: [],
    remove: [removePostFromUser()],
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
