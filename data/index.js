const postsData = require("./posts");
const userData = require("./users");
const likedata = require ("./likes")

module.exports = {
  users: userData,
  posts: postsData,
  likes:likedata
};