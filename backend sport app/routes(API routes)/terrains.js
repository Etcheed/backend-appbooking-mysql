const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Terrains');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching terrains', error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Terrains WHERE terrain_id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Terrain not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching terrain', error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    const { nom, adresse, type_sport, disponibilite } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO Terrains (nom, adresse, type_sport, disponibilite) VALUES (?, ?, ?, ?)',
        [nom, adresse, type_sport, disponibilite]
      );
      res.status(201).json({ message: 'Terrain created successfully', terrainId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating terrain', error: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    const { nom, adresse, type_sport, disponibilite } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE Terrains SET nom = ?, adresse = ?, type_sport = ?, disponibilite = ? WHERE terrain_id = ?',
        [nom, adresse, type_sport, disponibilite, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Terrain not found' });
      }
      res.json({ message: 'Terrain updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating terrain', error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM Terrains WHERE terrain_id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Terrain not found' });
      }
      res.json({ message: 'Terrain deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting terrain', error: error.message });
    }
  });

  return router;
};