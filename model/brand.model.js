const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const brandSchema = new mongoose.Schema({
  title: String,     
  slug: {
    type: String,
    slug: "title",
    unique: true
  },        // dùng cho URL
  description: String,
  status: String,     
  image: String,
  createdBy: {
    account_id: String,
    createdAt: Date
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  },
  position: Number
});
const Brand = mongoose.model('Brand', brandSchema, 'brand');
module.exports = Brand;