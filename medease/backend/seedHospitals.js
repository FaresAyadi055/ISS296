// Script to seed hospitals collection from hospitals.json
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Hospital schema must match the one in server.js
const hospitalSchema = new mongoose.Schema({
  id: Number,
  name: String,
  latitude: Number,
  longitude: Number,
  address: String,
  type: String,
  phone: String
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medease')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Read hospitals.json
const hospitalsPath = path.join(__dirname, '../src/repos/hospitals.json');
const hospitalsData = JSON.parse(fs.readFileSync(hospitalsPath, 'utf-8'));

const seedHospitals = async () => {
  try {
    await Hospital.deleteMany({});
    console.log('Cleared existing hospitals');
    const created = await Hospital.insertMany(hospitalsData.hospitals);
    console.log(`Seeded ${created.length} hospitals`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding hospitals:', err);
    mongoose.disconnect();
  }
};

seedHospitals();
