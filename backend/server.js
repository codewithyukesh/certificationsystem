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
 const fiscalYearRoutes = require('./routes/fiscalYearRoutes');
const letterheadRoutes = require('./routes/letterheadRoutes');
const savedTemplatesRoute = require('./routes/savedTemplates');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const issuedTemplatesRoutes = require('./routes/issuedTemplates'); // Updated route import
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/templates', templateRoutes);
 app.use('/api/fiscal-years', fiscalYearRoutes); 
app.use('/api/letterhead', letterheadRoutes);
app.use('/api/saved-templates', savedTemplatesRoute);
app.use('/api/users', userRoutes); // For fetching logged-in user's info
app.use('/api/issued-templates', issuedTemplatesRoutes); // Updated route use
app.use('/api', reportRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
