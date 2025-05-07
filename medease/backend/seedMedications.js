const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const medicationSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  dosage: String,
  sideEffects: String,
  image: String
});
const Medication = mongoose.model('Medication', medicationSchema);

// Try to load medications from JSON file if it exists, else use sampleMedications
let medicationsData = null;
const medicationsPath = path.join(__dirname, '../src/repos/medications.json');
if (fs.existsSync(medicationsPath)) {
  const fileData = JSON.parse(fs.readFileSync(medicationsPath, 'utf-8'));
  medicationsData = fileData.medications || fileData;
} else {
  medicationsData = [
    {
      name: "Paracetamol",
      category: "Pain Relief",
      description: "Used to treat mild to moderate pain and fever.",
      price: 5.99,
      dosage: "500mg every 4-6 hours",
      sideEffects: "Rarely causes side effects",
      image: "https://via.placeholder.com/300x200"
    },
    {
      name: "Azithromycin",
      category: "Antibiotics",
      description: "Antibiotic used to treat various infections.",
      price: 18.50,
      dosage: "500mg once daily for 3 days",
      sideEffects: "Nausea, diarrhea, abdominal pain",
      image: "https://via.placeholder.com/300x200"
    },
    {
      name: "Cetirizine",
      category: "Respiratory",
      description: "Antihistamine for allergy relief.",
      price: 7.25,
      dosage: "10mg once daily",
      sideEffects: "Drowsiness, dry mouth",
      image: "https://via.placeholder.com/300x200"
    },
    {
      name: "Atorvastatin",
      category: "Heart Health",
      description: "Used to lower cholesterol.",
      price: 22.00,
      dosage: "10-80mg once daily",
      sideEffects: "Muscle pain, liver issues",
      image: "https://via.placeholder.com/300x200"
    }
  ];
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medease')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedMedications = async () => {
  try {
    await Medication.deleteMany({});
    console.log('Cleared existing medications');
    const createdMeds = await Medication.insertMany(medicationsData);
    console.log(`Successfully seeded ${createdMeds.length} medications`);
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding medications:', error);
    mongoose.disconnect();
  }
};

seedMedications();
