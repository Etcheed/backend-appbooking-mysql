const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Coachs');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coaches', error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Coachs WHERE coach_id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Coach not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coach', error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    const { nom, email, telephone, specialites, disponibilite } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO Coachs (nom, email, telephone, specialites, disponibilite) VALUES (?, ?, ?, ?, ?)',
        [nom, email, telephone, specialites, disponibilite]
      );
      res.status(201).json({ message: 'Coach created successfully', coachId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating coach', error: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    const { nom, email, telephone, specialites, disponibilite } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE Coachs SET nom = ?, email = ?, telephone = ?, specialites = ?, disponibilite = ? WHERE coach_id = ?',
        [nom, email, telephone, specialites, disponibilite, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Coach not found' });
      }
      res.json({ message: 'Coach updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating coach', error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM Coachs WHERE coach_id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Coach not found' });
      }
      res.json({ message: 'Coach deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting coach', error: error.message });
    }
  });

  return router;
};