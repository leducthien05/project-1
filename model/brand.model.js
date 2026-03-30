const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  title: String,       // tên thương hiệu (Apple)
  slug: String,        // dùng cho URL
  description: String,
  status: String,       // active / inactive
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
const Brand =  mongoose.model('Brand', brandSchema, 'brand');
module.exports = Brand;