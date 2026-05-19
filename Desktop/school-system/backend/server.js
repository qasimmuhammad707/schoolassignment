const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Docker Compose ya Local setup ke liye dynamic URI
// Agar pipeline se MONGO_URI milegi to woh chalegi, nahi to local backup chalega
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoolDB';

// Is line ko bilkul line 13 ke sath replace karein:
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.log('Database Connection Error: ', err));

// Student Schema aur Model (Database Table Structure)
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    grade: { type: String, required: true }
});

const Student = mongoose.model('Student', StudentSchema);

// API Routes

// 1. Saare students database se lane ke liye (GET)
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Naya student database mein save karne ke liye (POST)
app.post('/api/students', async (req, res) => {
    const { name, grade } = req.body;
    if (!name || !grade) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    
    const newStudent = new Student({ name, grade });
    try {
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
