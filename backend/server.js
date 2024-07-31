const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/certificationsystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const templateRoutes = require('./routes/template');
const reportRoutes = require('./routes/report');
 

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/reports', reportRoutes); // Add this line for report routes
 
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
