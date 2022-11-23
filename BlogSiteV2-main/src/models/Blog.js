const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  blogContent: {
    type: String,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  dateModified: {
    type: Date,
    required: true,
  },
  username: {
    type: String,
    required: true,

  },
  userid: {
    type: String,
    required: true,

  },
  team: {
    type: String,
    required: true,

  }
});

module.exports = mongoose.model('Blog', BlogSchema)
