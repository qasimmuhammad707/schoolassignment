const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Docker Compose se connect karne ke liye dynamic URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoolDB';

// server.js ke andar mongoose connection code ko is se replace karo:
mongoose.connect('mongodb+srv://qasimjutt1416_db_user:972YlhpYiJYEtaH@schoolcluster.phnwpnu.mongodb.net/schoolDB?retryWrites=true&w=majority&appName=schoolcluster')
  .then(() => console.log('MongoDB Atlas Connected Successfully!'))
  .catch(err => console.log('Database Connection Error: ', err));

// Student Schema aur Model (Database Table Structure)
const StudentSchema = new mongoose.Schema({
  name: String,
  grade: String
});
const Student = mongoose.model('Student', StudentSchema);

// Data SAVE karne ki API (Jab form se submit hoga)
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save(); // Yeh line data ko Database mein save karegi
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Data READ karne ki API (List dekhne ke liye)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));
