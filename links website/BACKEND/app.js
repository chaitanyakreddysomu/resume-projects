const express = require('express');
const cors = require('cors');
require('dotenv').config();
const adminSettingsController = require('./controllers/adminSettingsController');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/links', require('./routes/links'));
app.use('/api/withdrawal', require('./routes/withdrawal'));
app.use('/api/admin', require('./routes/admin'));

app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize admin settings
  try {
    await adminSettingsController.initializeSettings();
    console.log('Admin settings initialized successfully');
  } catch (error) {
    console.error('Error initializing admin settings:', error);
  }
}); 