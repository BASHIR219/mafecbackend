const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserDataSchema = new Schema({

  registerDate: {
    type: Date,
    default: Date.now // Set the default value to the current date and time
  },

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
  sex: {
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
  categoryPreference: {
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
    unique: true,
    required: true
  },
  image: {
    type: Buffer,
    required: true
  },
  signature: {
    type: Buffer,
    required: true
  },
  identityProof: {
    type: Buffer,
    required: true
  },
  EWSCertificate: {
    type: Buffer,
  }


});

const UserData = mongoose.model('UserData', UserDataSchema);

module.exports = UserData;
