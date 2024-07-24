const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');

module.exports = (pool) => {
  // Get all users
  router.get('/', authMiddleware, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT utilisateur_id, nom, email, type_utilisateur, age, niveau FROM Utilisateurs');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  });

  // Get a specific user
  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT utilisateur_id, nom, email, type_utilisateur, age, niveau FROM Utilisateurs WHERE utilisateur_id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  });

  // Update a user
  router.put('/:id', authMiddleware, async (req, res) => {
    const { nom, email, mot_de_passe, type_utilisateur, age, niveau } = req.body;
    try {
      let query = 'UPDATE Utilisateurs SET ';
      const updateFields = [];
      const values = [];

      if (nom) {
        updateFields.push('nom = ?');
        values.push(nom);
      }
      if (email) {
        updateFields.push('email = ?');
        values.push(email);
      }
      if (type_utilisateur) {
        updateFields.push('type_utilisateur = ?');
        values.push(type_utilisateur);
      }
      if (age) {
        updateFields.push('age = ?');
        values.push(age);
      }
      if (niveau) {
        updateFields.push('niveau = ?');
        values.push(niveau);
      }
      if (mot_de_passe) {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        updateFields.push('mot_de_passe = ?');
        values.push(hashedPassword);
      }

      query += updateFields.join(', ') + ' WHERE utilisateur_id = ?';
      values.push(req.params.id);

      const [result] = await pool.query(query, values);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  });

  // Delete a user
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM Utilisateurs WHERE utilisateur_id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  });

  return router;
};