const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Added 'PATCH'
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medease')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schemas
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

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  dob: { type: Date, default: Date.now },
  gender: { type: String, default: '' },
  healthConditions: {
    chronic: String,
    medications: String,
    allergies: String,
    reminders: { type: Array, default: [] }
  },
  photo: String
});

// Hospital Schema
const hospitalSchema = new mongoose.Schema({
  id: Number,
  name: String,
  latitude: Number,
  longitude: Number,
  address: String,
  type: String,
  phone: String
});

const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Medication Schema
const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: Number,
  dosage: String,
  sideEffects: String,
  image: String
});
const Medication = mongoose.model('Medication', medicationSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Doctor Authentication Routes
app.post('/api/doctors/register', upload.single('photo'), async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, specialty, phoneNumber, description, workingHours } = req.body;
    
    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse working hours
    const parsedWorkingHours = JSON.parse(workingHours);

    // Create new doctor
    const doctor = new Doctor({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      specialty,
      phoneNumber,
      description,
      workingHours: parsedWorkingHours,
      photo: req.file ? req.file.path : null,
      rating: (Math.random() * (4.9 - 3.5) + 3.5).toFixed(1)
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/doctors/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find doctor
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: doctor._id, email: doctor.email, role: 'doctor' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialty: doctor.specialty
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Patient Authentication Routes
app.post('/api/patients/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, phone, dob, gender, healthConditions, photo } = req.body;
    
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new patient
    const patient = new Patient({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      phone,
      dob,
      gender,
      photo,
      healthConditions: {
        ...healthConditions,
        reminders: []
      }
    });

    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/patients/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find patient
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, patient.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: patient._id, email: patient.email, role: 'patient' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return token and patient data
    res.json({
      token,
      patient: {
        _id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        address: patient.address,
        phone: patient.phone,
        gender: patient.gender,
        photo: patient.photo,
        healthConditions: patient.healthConditions
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  patientId: { type: String, required: true },
  date: { type: String, required: true }, // Add the date field
  createdAt: { type: Date, default: Date.now },
  paid: { type: Boolean, default: false } // Add paid field
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Routes
app.get('/api/appointments/:doctorId', async (req, res) => {
  try {
    console.log('Fetching appointments for doctor:', req.params.doctorId);
    const appointments = await Appointment.find({ doctorId: req.params.doctorId }).populate('patientId', 'firstName lastName');
    console.log('Found appointments:', appointments);
    res.json(appointments || []); // Return empty array if no appointments found
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    console.log('Received appointment data:', req.body);
    
    // Validate required fields
    const { doctorId, day, time, patientId } = req.body;
    if (!doctorId || !day || !time || !patientId) {
      throw new Error('Missing required fields');
    }

    // Check if appointment already exists
    const existingAppointment = await Appointment.findOne({
      doctorId,
      day,
      time
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    console.log('Saved appointment:', savedAppointment);
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to update payment status of an appointment
app.patch('/api/appointments/:id/pay', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: { paid: true } },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patient' });
  }
});

app.put('/api/patients/update/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient' });
  }
});

// Add this route to handle adding reminders
app.post('/api/patients/:id/reminders', async (req, res) => {
  try {
    const { id } = req.params;
    const { medication, frequency, time, duration } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newReminder = {
      _id: uuidv4(),
      medication,
      frequency,
      time,
      duration
    };

    patient.healthConditions.reminders.push(newReminder);
    await patient.save();

    console.log('Added Reminder:', newReminder);

    res.status(201).json(patient);
  } catch (error) {
    console.error('Error adding reminder:', error);
    res.status(500).json({ message: 'Error adding reminder' });
  }
});

// Add this route to handle deleting reminders
app.delete('/api/patients/:id/reminders/:reminderId', async (req, res) => {
  try {
    const { id, reminderId } = req.params;

    // Find the patient by ID
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Remove the reminder from the patient's health conditions
    patient.healthConditions.reminders = patient.healthConditions.reminders.filter(reminder => reminder._id.toString() !== reminderId);

    // Save the updated patient
    await patient.save();

    res.status(200).json({ message: 'Reminder deleted successfully' }); // Return a success message
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Error deleting reminder' });
  }
});

// Add this route to fetch all patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Add this route to fetch all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    console.log('Fetched doctors from database:', doctors.length);
    console.log('Sample doctor data:', doctors.length > 0 ? doctors[0] : 'No doctors found');
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Add this route to handle chatbot doctor queries
app.post('/api/chatbot/doctors', async (req, res) => {
  try {
    const { specialty, day, time } = req.body;
    let query = {};
    if (specialty) query.specialty = specialty;

    // Get all doctors with the specialty
    let doctors = await Doctor.find(query);

    // If day and time are provided, filter for availability
    if (day && time) {
      // Get all appointments for that day/time
      const appointments = await Appointment.find({ day, time });
      const bookedDoctorIds = appointments.map(a => a.doctorId.toString());

      // Filter doctors who have a working slot at that day/time and are not booked
      doctors = doctors.filter(doc => {
        const slots = (doc.workingHours?.[day] || []);
        const hasSlot = slots.some(slot => {
          // Check if time is within slot
          const start = slot.startTime;
          const end = slot.endTime;
          return time >= start && time < end;
        });
        return hasSlot && !bookedDoctorIds.includes(doc._id.toString());
      });
    }

    res.json(doctors.map(doc => ({
      _id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      specialty: doc.specialty
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Add this route to fetch a single doctor by ID
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

// Add this route to update a doctor's information
app.put('/api/doctors/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove password from updates if it exists
    delete updates.password;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(400).json({ message: error.message });
  }
});

// Add this route to fetch all hospitals
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospitals' });
  }
});

// Add this route to add a new hospital
app.post('/api/hospitals', async (req, res) => {
  try {
    const { name, type, address, phone } = req.body;
    // Optionally, you can add latitude/longitude if needed
    const hospital = new Hospital({ name, type, address, phone });
    await hospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all medications
app.get('/api/medications', async (req, res) => {
  try {
    const meds = await Medication.find();
    res.json(meds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medications' });
  }
});

// (Optional) Add a route to add a medication (for testing)
app.post('/api/medications', async (req, res) => {
  try {
    const med = new Medication(req.body);
    await med.save();
    res.status(201).json(med);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a medication by ID
app.delete('/api/medications/:id', async (req, res) => {
  try {
    await Medication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- DELETE ROUTES FOR ADMIN ---
app.delete('/api/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/hospitals/:id', async (req, res) => {
  try {
    await Hospital.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hospital deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});