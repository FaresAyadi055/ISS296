const mongoose = require('mongoose');

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

const sampleMedications = [
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

const seedMedications = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/medease');
    console.log('Connected to MongoDB');
    await Medication.deleteMany({});
    console.log('Cleared existing medications');
    const createdMeds = await Medication.insertMany(sampleMedications);
    console.log(`Successfully seeded ${createdMeds.length} medications`);
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding medications:', error);
    mongoose.disconnect();
  }
};

seedMedications();
