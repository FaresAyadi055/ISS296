const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: Number,
  dosage: String,
  sideEffects: String,
  image: String,
  stock: { type: Number, default: 0 }
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
      price: 17.9,
      dosage: "500mg every 4-6 hours",
      sideEffects: "Rarely causes side effects",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPRZ7OJLFc6xnOAtowHLTSPtSTxsz3zP8lHw&s",
      stock: 10
    },
    {
      name: "Azithromycin",
      category: "Antibiotics",
      description: "Antibiotic used to treat various infections.",
      price: 18.50,
      dosage: "500mg once daily for 3 days",
      sideEffects: "Nausea, diarrhea, abdominal pain",
      image: "https://www.biofieldpharma.com/wp-content/uploads/2023/06/BIOFIELD-OZISET-500-TAB-1-scaled.jpg",
      stock: 10
    },
    {
      name: "Cetirizine",
      category: "Respiratory",
      description: "Antihistamine for allergy relief.",
      price: 21.75,
      dosage: "10mg once daily",
      sideEffects: "Drowsiness, dry mouth",
      image: "https://cdn.foxpharma.co.uk/wp-content/uploads/2024/09/Cetirizine-10mg.jpg",
      stock: 10
    },
    {
      name: "Atorvastatin",
      category: "Heart Health",
      description: "Used to lower cholesterol.",
      price: 66.00,
      dosage: "10-80mg once daily",
      sideEffects: "Muscle pain, liver issues",
      image: "https://medecify.com/storages/2024/07/IMG-331-scaled.jpeg",
      stock: 10
    },
    
    {
          name: "Ibuprofen",
          category: "Pain Relief",
          description: "Nonsteroidal anti-inflammatory drug used to reduce fever and treat pain or inflammation.",
          price: 20.99,
          dosage: "200-400mg every 4-6 hours as needed",
          sideEffects: "Stomach pain, nausea, dizziness",
          image: "https://www.ashcroftpharmacy.co.uk/uploads/images/products/large/ashcroft-pharmacy-ibuprofen-400mg-tablets-1740783905Ibuprofen-400mg-Tablets.png",
          stock: 10
    },
        {
          name: "Amoxicillin",
          category: "Antibiotics",
          description: "Penicillin-type antibiotic used to treat bacterial infections.",
          price: 38.99,
          dosage: "500mg every 8 hours",
          sideEffects: "Nausea, rash, diarrhea",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRROZAnDcsaS0_0gx-96E_7YOXYE7-ybE0FzQ&s",
          stock: 0
        },
        {
          name: "Loratadine",
          category: "Allergy Relief",
          description: "Non-drowsy antihistamine for allergy symptoms such as runny nose and sneezing.",
          price: 25.49,
          dosage: "10mg once daily",
          sideEffects: "Headache, dry mouth",
          image: "https://firstaidsuppliesonline.com/wp-content/uploads/2017/12/p-15349-214470_loratadineAllergyTabs_30box-e1722026035520.jpg",
          stock: 10
        },
        {
          name: "Metformin",
          category: "Diabetes",
          description: "Helps control blood sugar levels in people with type 2 diabetes.",
          price: 47.25,
          dosage: "500-1000mg twice daily with meals",
          sideEffects: "Stomach upset, diarrhea, metallic taste",
          image: "https://images.ctfassets.net/4w8qvp17lo47/6vXaH4Y5Gw6AMEmASwGkc6/e6ff962a82811e4d160cc2d5c0d8b3cb/metformin-antidiabetic-tablets-science-photo-library.jpg",
          stock: 0
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
