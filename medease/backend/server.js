const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medease')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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