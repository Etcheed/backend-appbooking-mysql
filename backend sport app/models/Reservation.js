const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const pool = mysql.createPool(config.development);

class Reservation {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Reservations');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Reservations WHERE reservation_id = ?', [id]);
    return rows[0];
  }

  static async create(reservationData) {
    const { utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut } = reservationData;
    const [result] = await pool.query(
      'INSERT INTO Reservations (utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut]
    );
    return result.insertId;
  }

  static async update(id, reservationData) {
    const { utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut } = reservationData;
    const [result] = await pool.query(
      'UPDATE Reservations SET utilisateur_id = ?, terrain_id = ?, coach_id = ?, date_reservation = ?, heure_debut = ?, heure_fin = ?, statut = ? WHERE reservation_id = ?',
      [utilisateur_id, terrain_id, coach_id, date_reservation, heure_debut, heure_fin, statut, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Reservations WHERE reservation_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Reservation;