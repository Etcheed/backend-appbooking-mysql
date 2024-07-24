const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const pool = mysql.createPool(config.development);

class Sport {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Sports');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Sports WHERE sport_id = ?', [id]);
    return rows[0];
  }

  static async create(sportData) {
    const { nom } = sportData;
    const [result] = await pool.query('INSERT INTO Sports (nom) VALUES (?)', [nom]);
    return result.insertId;
  }

  static async update(id, sportData) {
    const { nom } = sportData;
    const [result] = await pool.query('UPDATE Sports SET nom = ? WHERE sport_id = ?', [nom, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Sports WHERE sport_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Sport;