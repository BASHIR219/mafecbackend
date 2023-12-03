const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  testCentre: { type: String, required: true },
  phone: { type: String, required: true },
});

const MafecPayment = mongoose.model('MafecPayment', userSchema);

module.exports = MafecPayment;