const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medease')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Doctor Schema - Must match the one in server.js
const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  specialty: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  photo: { type: String },
  description: { type: String, required: true },
  workingHours: {
    monday: [{ startTime: String, endTime: String }],
    tuesday: [{ startTime: String, endTime: String }],
    wednesday: [{ startTime: String, endTime: String }],
    thursday: [{ startTime: String, endTime: String }],
    friday: [{ startTime: String, endTime: String }],
    saturday: [{ startTime: String, endTime: String }],
    sunday: [{ startTime: String, endTime: String }]
  },
  rating: { type: String, required: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// Sample doctors data
const sampleDoctors = [
  {
    firstName: "Kamel",
    lastName: "Ouertani",
    email: "kamel.ouertani@example.com",
    password: "password123",
    address: "Tunis",
    specialty: "Endocrinologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://thumbs.dreamstime.com/b/young-male-doctor-close-up-happy-looking-camera-56751540.jpg",
    description: "Studied at University of Tunis and completed residency at Charles Nicolle Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "15:00", endTime: "17:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:30", endTime: "16:30" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:00", endTime: "15:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "3.9"
  },
  {
    firstName: "Leila",
    lastName: "Masmoudi",
    email: "leila.masmoudi@example.com",
    password: "password123",
    address: "Bizerte",
    specialty: "Ophthalmologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://t3.ftcdn.net/jpg/05/04/25/70/360_F_504257032_jBtwqNdvdMN9Xm6aDT0hcvtxDXPZErrn.jpg",
    description: "Studied at University of Sfax and completed residency at Habib Bourguiba University Hospital",
    workingHours: {
      monday: [{ startTime: "08:00", endTime: "10:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "15:00", endTime: "17:00" }],
      wednesday: [{ startTime: "08:30", endTime: "10:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:30", endTime: "16:30" }],
      friday: [{ startTime: "08:00", endTime: "10:00" }, { startTime: "12:00", endTime: "14:00" }],
      saturday: [{ startTime: "09:00", endTime: "11:00" }],
      sunday: []
    },
    rating: "4.0"
  },
  {
    firstName: "Ahmed",
    lastName: "Khaled",
    email: "ahmed.khaled@example.com",
    password: "password123",
    address: "Tunis",
    specialty: "Cardiologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://media.istockphoto.com/id/1346124900/photo/confident-successful-mature-doctor-at-hospital.jpg?s=612x612&w=0&k=20&c=S93n5iTDVG3_kJ9euNNUKVl9pgXTOdVQcI_oDGG-QlE=",
    description: "Studied at University of Tunis El Manar and completed residency at Rabta Hospital",
    workingHours: {
      monday: [{ startTime: "08:00", endTime: "10:00" }, { startTime: "13:00", endTime: "15:00" }],
      tuesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "14:30", endTime: "16:30" }],
      wednesday: [{ startTime: "08:30", endTime: "10:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "15:00", endTime: "17:00" }],
      friday: [{ startTime: "08:00", endTime: "10:00" }, { startTime: "14:00", endTime: "16:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.2"
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    address: "Monastir",
    specialty: "Cardiologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=640:*",
    description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
    workingHours: {
      monday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:30", endTime: "15:30" }],
      wednesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:30", endTime: "16:30" }],
      thursday: [{ startTime: "08:30", endTime: "10:30" }, { startTime: "12:30", endTime: "14:30" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "15:00", endTime: "17:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.5"
  },
  {
    firstName: "Sarah",
    lastName: "Smith",
    email: "sarah.smith@example.com",
    password: "password123",
    address: "Nabeul",
    specialty: "Neurologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg",
    description: "Studied at University of Sfax and completed residency at Sfax University Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "15:00", endTime: "17:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:30", endTime: "16:30" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:00", endTime: "15:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.7"
  },
  {
    firstName: "Zied",
    lastName: "Ladhari",
    email: "zied.ladhari@example.com",
    password: "password123",
    address: "Sousse",
    specialty: "Pediatrician",
    phoneNumber: "+216 23 654 321",
    photo: "https://nmc.ae/_next/image?url=https%3A%2F%2Fstatic-cdn.nmc.ae%2Fstrapi%2FDr_Amro_90f95a38db.png&w=3840&q=75",
    description: "Studied at University of Sousse and completed residency at Sahloul University Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "08:00", endTime: "10:00" }, { startTime: "13:00", endTime: "15:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "14:00", endTime: "16:00" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:00", endTime: "16:00" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "15:00", endTime: "17:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.3"
  },
  {
    firstName: "Amina",
    lastName: "Khelifa",
    email: "amina.khelifa@example.com",
    password: "password123",
    address: "Sousse",
    specialty: "Dermatologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://media.istockphoto.com/id/1372002650/photo/cropped-portrait-of-an-attractive-young-female-doctor-standing-with-her-arms-folded-in-the.jpg?s=612x612&w=0&k=20&c=o1QtStNsowOU0HSof6xQ_jZMglU8ZK565gHd655U6S4=",
    description: "Studied at University of Sousse and completed residency at Sahloul University Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "15:00", endTime: "17:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:00", endTime: "15:00" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:30", endTime: "16:30" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:00", endTime: "15:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.9"
  },
  {
    firstName: "Sami",
    lastName: "Ben Ali",
    email: "sami.benali@example.com",
    password: "password123",
    address: "Tunis",
    specialty: "Cardiologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://previews.123rf.com/images/dolgachov/dolgachov1307/dolgachov130700228/20605818-bright-picture-of-male-doctor-with-stethoscope.jpg",
    description: "Studied at University of Tunis and completed residency at Rabta Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "15:00", endTime: "17:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:00", endTime: "16:00" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:00", endTime: "15:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "3.9"
  },
  {
    firstName: "Tarek",
    lastName: "Ayari",
    email: "tarek.ayari@example.com",
    password: "password123",
    address: "Monastir",
    specialty: "Psychiatrist",
    phoneNumber: "+216 23 654 321",
    photo: "https://st4.depositphotos.com/1017986/21088/i/450/depositphotos_210888716-stock-photo-happy-doctor-with-clipboard-at.jpg",
    description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "15:00", endTime: "17:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:30", endTime: "16:30" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:00", endTime: "15:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.5"
  },
  {
    firstName: "Manel",
    lastName: "Ben Ahmed",
    email: "manel.benahmed@example.com",
    password: "password123",
    address: "Kairouan",
    specialty: "Dermatologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://plus.unsplash.com/premium_photo-1664475450083-5c9eef17a191?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwZG9jdG9yfGVufDB8fDB8fHww",
    description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:00", endTime: "16:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:00", endTime: "16:00" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:00", endTime: "15:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "3.7"
  },
  {
    firstName: "Sarah",
    lastName: "Aloui",
    email: "sarah.aloui@example.com",
    password: "password123",
    address: "Nabeul",
    specialty: "Gastroenterologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://i.pinimg.com/736x/b9/97/a5/b997a530822d0f2c03259070d4590d45.jpg",
    description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "15:00", endTime: "17:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:00", endTime: "16:00" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:00", endTime: "15:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.2"
  },
  {
    firstName: "Khaled",
    lastName: "Cherif",
    email: "khaled.cherif@example.com",
    password: "password123",
    address: "Bizerte",
    specialty: "Neurologist",
    phoneNumber: "+216 23 654 321",
    photo: "https://cdn.prod.website-files.com/62d4f06f9c1357a606c3b7ef/65ddf3cdf19abaf5688af2f8_shutterstock_1933145801%20(1).jpg",
    description: "Studied at University of Sfax and completed residency at Sfax University Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:00", endTime: "16:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:00", endTime: "15:00" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:30", endTime: "16:30" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:30", endTime: "15:30" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.7"
  },
  {
    firstName: "Yassir",
    lastName: "Zribi",
    email: "yassir.zribi@example.com",
    password: "password123",
    address: "Monastir",
    specialty: "Pediatrician",
    phoneNumber: "+216 23 654 321",
    photo: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
    workingHours: {
      monday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "16:00" }],
      tuesday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "15:00", endTime: "17:00" }],
      wednesday: [{ startTime: "09:30", endTime: "11:30" }, { startTime: "13:30", endTime: "15:30" }],
      thursday: [{ startTime: "10:00", endTime: "12:00" }, { startTime: "14:30", endTime: "16:30" }],
      friday: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "13:00", endTime: "15:00" }],
      saturday: [{ startTime: "10:00", endTime: "12:00" }],
      sunday: []
    },
    rating: "4.8"
  }
];

// Function to seed doctors
const seedDoctors = async () => {
  try {
    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Hash passwords and create new doctors
    const doctorsWithHashedPasswords = await Promise.all(
      sampleDoctors.map(async (doctor) => {
        const hashedPassword = await bcrypt.hash(doctor.password, 10);
        return {
          ...doctor,
          password: hashedPassword
        };
      })
    );

    // Insert the new doctors
    const createdDoctors = await Doctor.insertMany(doctorsWithHashedPasswords);
    console.log(`Successfully seeded ${createdDoctors.length} doctors`);
    console.log('Doctor IDs:', createdDoctors.map(doc => doc._id));

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding doctors:', error);
    mongoose.disconnect();
  }
};

// Run the seed function
seedDoctors(); 