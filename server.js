const express = require('express');
const mongoose = require('mongoose');
const UserData = require('./schema'); // Importing the Mongoose model
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const modifyPdf = require('./modifyPdf');
const { Buffer } = require('buffer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.URL;
// const MONGODB_URI = "mongodb+srv://shraddhasehrawat505:Bashir@mafec-db.xolgkb6.mongodb.net/";

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
// Set up multer storage for the first image
const firstImageStorage = multer.memoryStorage();
const uploadFirstImage = multer({ storage: firstImageStorage }).single('image'); // 'image' is the field name for the first image

// Set up multer storage for the second image
const secondImageStorage = multer.memoryStorage();
const uploadSecondImage = multer({ storage: secondImageStorage }).single('signature'); // 'signature' is the field name for the second image


const generateRegistrationNumber = () => {
  // const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // All uppercase letters
  const numbers = '0123456789'; // All digits

  let registrationNumber = 'Y24LAW';

  // Generate the last three characters (numbers)
  for (let i = 0; i < 4; i++) {
    registrationNumber += numbers[Math.floor(Math.random() * numbers.length)];
  }
  console.log("registration number is ", registrationNumber);
  return registrationNumber;
};



app.post('/api/form', upload.fields([{ name: 'image' }, { name: 'signature' }]), async (req, res) => {
  try {
    // Handle the first image
    const imageBuffer = req.files['image'][0].buffer;

    // Handle the second image
    const signatureBuffer = req.files['signature'][0].buffer;

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
      class12Percentage, stream, phoneNumber, image: imageBuffer, signature: signatureBuffer
    });

    await userData.save();

    res.status(201).json({ message: 'Form data and images uploaded successfully.' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message }); // Send the error message to the client
  }
});

//Get user data using registration
const fs = require('fs');

app.get('/api/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const user = await UserData.findOne({ registrationNumber });

    if (user) {
      const modifiedPdf = await modifyPdf(user);
      const modifiedPdfBuffer = Buffer.from(modifiedPdf);

      // Write the modified PDF file to disk.
      await fs.promises.writeFile('./admit-card.pdf', modifiedPdfBuffer);

      // Read the modified PDF file from disk.
      const modifiedPdfBytes = await fs.promises.readFile('./admit-card.pdf');

      // Set the content type of the response.
      res.setHeader('Content-Type', 'application/pdf');

      // Send the modified PDF file to the client.
      res.send(modifiedPdfBytes);
    } else {
      res.status(404).json({ error: 'User not found from server.js' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error from server.js' });
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
