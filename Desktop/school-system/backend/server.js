const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Docker Compose se aane wali MONGO_URI uthao, nahi to backup local URL use karo
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoolDB';

// Yahan MONGO_URI bilkul sahi tarah define ho chuki hai
mongoose.connect(MONGO_URI)
  .then(() => console.log('Local MongoDB Connected Successfully!'))
  .catch(err => console.log('Database Connection Error: ', err));

// Student Schema aur Model
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    grade: { type: String, required: true }
});

const Student = mongoose.model('Student', StudentSchema);

// API Routes

// 1. Saare students lane ke liye (GET)
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Naya student save karne ke liye (POST)
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
