const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const pool = mysql.createPool(config.development);

class Coach {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Coachs');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Coachs WHERE coach_id = ?', [id]);
    return rows[0];
  }

  static async create(coachData) {
    const { nom, email, telephone, specialites, disponibilite } = coachData;
    const [result] = await pool.query(
      'INSERT INTO Coachs (nom, email, telephone, specialites, disponibilite) VALUES (?, ?, ?, ?, ?)',
      [nom, email, telephone, specialites, disponibilite]
    );
    return result.insertId;
  }

  static async update(id, coachData) {
    const { nom, email, telephone, specialites, disponibilite } = coachData;
    const [result] = await pool.query(
      'UPDATE Coachs SET nom = ?, email = ?, telephone = ?, specialites = ?, disponibilite = ? WHERE coach_id = ?',
      [nom, email, telephone, specialites, disponibilite, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Coachs WHERE coach_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Coach;