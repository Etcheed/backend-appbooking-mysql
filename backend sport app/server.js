const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('./config/config.json');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const pool = mysql.createPool({
  host: config.development.host,
  user: config.development.username,
  password: config.development.password,
  database: config.development.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Make db available to our routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Import routes
const authRoutes = require('./routes/auth')(pool);
const terrainsRoutes = require('./routes/terrains')(pool);
const coachesRoutes = require('./routes/coaches')(pool);
const reservationsRoutes = require('./routes/reservations')(pool);
const usersRoutes = require('./routes/users')(pool);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/terrains', terrainsRoutes);
app.use('/api/coaches', coachesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});