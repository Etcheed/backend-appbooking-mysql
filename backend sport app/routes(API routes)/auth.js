const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
  router.post('/register', async (req, res) => {
    const { nom, email, mot_de_passe, type_utilisateur, age, niveau } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      const [result] = await pool.query(
        'INSERT INTO Utilisateurs (nom, email, mot_de_passe, type_utilisateur, age, niveau) VALUES (?, ?, ?, ?, ?, ?)',
        [nom, email, hashedPassword, type_utilisateur, age, niveau]
      );
      
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  });

  router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;
    
    try {
      const [users] = await pool.query('SELECT * FROM Utilisateurs WHERE email = ?', [email]);
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      
      const user = users[0];
      const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      
      const token = jwt.sign(
        { userId: user.utilisateur_id, email: user.email },
        'your_jwt_secret',
        { expiresIn: '1h' }
      );
      
      res.json({ message: 'Authentication successful', token, userId: user.utilisateur_id });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  });

  return router;
};