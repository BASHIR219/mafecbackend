const express = require('express');
const mongoose = require('mongoose');
const UserData = require('./schema'); // Importing the Mongoose model
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const { Buffer } = require('buffer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.URL;
const MONGODB_URI = "mongodb+srv://shraddhasehrawat505:Bashir54321@mafec-db.xolgkb6.mongodb.net/";

app.use(express.json())
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const upload = multer();

const generateRegistrationNumber = () => {

  const numbers = '0123456789'; // All digits

  let registrationNumber = 'Y24LAW';

  // Generate the last three characters (numbers)
  for (let i = 0; i < 4; i++) {
    registrationNumber += numbers[Math.floor(Math.random() * numbers.length)];
  }
  console.log("registration number is ", registrationNumber);
  return registrationNumber;
};

app.post('/api/form', upload.fields([{ name: 'image' }, { name: 'signature' },  { name: 'identityProof' }]), async (req, res) => {
  try {
    // Handle the first image
    const imageBuffer = req.files['image'][0].buffer;

    // Handle the second image
    const signatureBuffer = req.files['signature'][0].buffer;

    // Handle the second image
    const identityProofBuffer = req.files['identityProof'][0].buffer;


    let registrationNumber;
    let isUnique = false;

    // Keep generating registration numbers until a unique one is found
    while (!isUnique) {
      registrationNumber = generateRegistrationNumber();

      // Check if the generated registration number already exists in the database
      const existingUser = await UserData.findOne({ registrationNumber });
      console.log("getting same registration number", registrationNumber);
      if (!existingUser) {
        isUnique = true;
      }
    }

    const {
      firstName, lastName, email, fatherName, motherName, address, state, postalCode, centerPreference,
      class12Percentage, stream, phoneNumber
    } = req.body;

    const userData = new UserData({
      registrationNumber, firstName, lastName, email, fatherName, motherName, address, state, postalCode, centerPreference,
      class12Percentage, stream, phoneNumber, image: imageBuffer, signature: signatureBuffer, identityProof: identityProofBuffer
    });

    await userData.save();

    res.status(201).json({ message: 'Form data and images uploaded successfully.' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    //Check if the error is a MongoDB duplicate key error (11000 code indicates duplicate key error)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.phoneNumber) {
      // If the error is due to a duplicate phone number, send a specific error message to the client
      return res.status(400).json({ error: 'A Student with this number is already registered' });
    }

    res.status(500).json({ error: error.message }); // Send the error message to the client
  }
});

app.get('/api/form/:registrationNumber', async (req, res) =>{

    const {registrationNumber} = req.params;
    try {
      const user = await UserData.findOne({registrationNumber});
      if(user){
        console.log("user details found!");
        res.json(user);
      }
      else{
        res.status(400).json({message:"user not found for this reg. number"});
      }
    } catch (error) {
       res.status(500).json({ message: 'Internal server error in finding user.' });
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
