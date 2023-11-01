const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserDataSchema = new Schema({
  registrationNumber: {
    type: String,
    unique: true, // Ensures uniqueness of registration numbers
   
  },

  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  centerPreference: {
    type: String,
    required: true
  },
  class12Percentage: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    // required: true
  },
  signature: {
    type: Buffer,
    // required: true
  }

});

const UserData = mongoose.model('UserData', UserDataSchema);

module.exports = UserData;
