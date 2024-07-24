const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const pool = mysql.createPool(config.development);

class Terrain {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Terrains');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Terrains WHERE terrain_id = ?', [id]);
    return rows[0];
  }

  static async create(terrainData) {
    const { nom, adresse, type_sport, disponibilite } = terrainData;
    const [result] = await pool.query(
      'INSERT INTO Terrains (nom, adresse, type_sport, disponibilite) VALUES (?, ?, ?, ?)',
      [nom, adresse, type_sport, disponibilite]
    );
    return result.insertId;
  }

  static async update(id, terrainData) {
    const { nom, adresse, type_sport, disponibilite } = terrainData;
    const [result] = await pool.query(
      'UPDATE Terrains SET nom = ?, adresse = ?, type_sport = ?, disponibilite = ? WHERE terrain_id = ?',
      [nom, adresse, type_sport, disponibilite, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Terrains WHERE terrain_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Terrain;