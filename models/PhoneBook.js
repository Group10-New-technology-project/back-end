const mongoose = require("mongoose");

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  updateat: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const PhoneBook = mongoose.model("PhoneBook", phoneBookSchema);
module.exports = PhoneBook;
