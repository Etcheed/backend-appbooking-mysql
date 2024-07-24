const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Reservations');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reservations', error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Reservations WHERE reservation_id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reservation', error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    const { utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO Reservations (utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut]
      );
      res.status(201).json({ message: 'Reservation created successfully', reservationId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating reservation', error: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    const { utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE Reservations SET utilisateur_id = ?, terrain_id = ?, coach_id = ?, date_reservation = ?, heure_debut = ?, heure_fin = ?, statut = ? WHERE reservation_id = ?',
        [utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.json({ message: 'Reservation updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating reservation', error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM Reservations WHERE reservation_id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting reservation', error: error.message });
    }
  });

  return router;
};