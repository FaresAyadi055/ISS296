const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
  location: { type: String, required: true },
  schedule: {
    type: Map,
    of: [String],
    default: new Map()
  }
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
    allergies: String
  },
  photo: String
});

const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);

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
app.post('/api/doctors/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, specialty, phoneNumber, location } = req.body;
    
    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new doctor
    const doctor = new Doctor({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      specialty,
      phoneNumber,
      location
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
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
    const { firstName, lastName, email, password, address, phone, dob, gender, healthConditions } = req.body;
    
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
      healthConditions
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

    res.json({
      token,
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  doctorId: { type: Number, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  patientId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Routes
app.get('/api/appointments/:doctorId', async (req, res) => {
  try {
    console.log('Fetching appointments for doctor:', req.params.doctorId);
    const appointments = await Appointment.find({ doctorId: parseInt(req.params.doctorId, 10) });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 