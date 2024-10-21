const express = require('express');
const mongoose = require('mongoose');
const UserData = require('./schema'); // Importing the Mongoose model
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const { Buffer } = require('buffer');
require('dotenv').config();
const MafecPayment = require('./paymentSchema');

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

  let registrationNumber = 'Y25LAW';

  // Generate the last three characters (numbers)
  for (let i = 0; i < 4; i++) {
    registrationNumber += numbers[Math.floor(Math.random() * numbers.length)];
  }
  console.log("registration number is ", registrationNumber);
  return registrationNumber;
};

app.post('/api/form', upload.fields([{ name: 'image' }, { name: 'signature' },  { name: 'identityProof' }, { name: 'EWSCertificate' }]), async (req, res) => {
  try {
    // Handle the first image
    const imageBuffer = req.files['image'][0].buffer;

    // Handle the second image
    const signatureBuffer = req.files['signature'][0].buffer;

    // Handle the third image
    const identityProofBuffer = req.files['identityProof'][0].buffer;

    // Handle the fourth image
    let EWSCertificateBuffer = null;  // Default to null for optional field
    if (req.files['EWSCertificate']) {
      EWSCertificateBuffer = req.files['EWSCertificate'][0].buffer;
    }


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
      firstName, lastName, email, fatherName, motherName, sex, address, state, postalCode, centerPreference,categoryPreference,
      class12Percentage, stream, phoneNumber
    } = req.body;

    const userData = new UserData({
      registrationNumber, firstName, lastName, email, fatherName, motherName, sex, address, state, postalCode, centerPreference, categoryPreference,
      class12Percentage, stream, phoneNumber, image: imageBuffer, signature: signatureBuffer, identityProof: identityProofBuffer, EWSCertificate: EWSCertificateBuffer
    });

    await userData.save();

    res.status(201).json({ message: 'Form data and images uploaded successfully.' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    //Check if the error is a MongoDB duplicate key error (11000 code indicates duplicate key error)
    if (error.code === 11000) {
      // If the error is due to a duplicate phone number, send a specific error message to the client
      return res.status(400).json({ error: 'A Student with this number is already registered' });
    }

    res.status(500).json({ error: error.message }); // Send the error message to the client
  }
});

app.get('/api/form/:phoneNumber', async (req, res) =>{

    const {phoneNumber} = req.params;
    try {
      const user = await UserData.findOne({phoneNumber});
      if(user){
        console.log("user details found!");
        res.json(user);
      }
      else{
        res.status(400).json({message:"user not found for this reg. number"});
      }
    } catch (error) {
       res.status(500).json({ message:'Internal server error in finding user.' });
    }
})

//CHEKING PAYMENT STATUS
app.get('/api/form/payment/:phoneNumber', async (req, res) => {

  const { phoneNumber } = req.params;

  try {
    // Find user based on the provided phone number
    const paymentData = await MafecPayment.findOne({ phone: phoneNumber });

    if (!paymentData) {
      return res.status(404).json({ message: 'Registration fee not paid. Please complete the payment.'});
    }
    res.json(paymentData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error for payment' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
