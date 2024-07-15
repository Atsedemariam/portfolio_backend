const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for your form data
const ContactFormSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

// Define a model based on the schema
const ContactForm = mongoose.model('ContactForm', ContactFormSchema);

// Route to handle form submission
app.post('/submit-form', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation (if needed)
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please fill out all fields' });
  }

  try {
    // Create a new document in MongoDB
    const formData = new ContactForm({
      name,
      email,
      subject,
      message
    });

    // Save the form data
    await formData.save();

    // Respond with success
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
