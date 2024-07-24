const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const pool = mysql.createPool(config.development);

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Utilisateurs WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(userData) {
    const { nom, email, mot_de_passe, type_utilisateur, age, niveau } = userData;
    const [result] = await pool.query(
      'INSERT INTO Utilisateurs (nom, email, mot_de_passe, type_utilisateur, age, niveau) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, email, mot_de_passe, type_utilisateur, age, niveau]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Utilisateurs WHERE utilisateur_id = ?', [id]);
    return rows[0];
  }

  static async update(id, userData) {
    const { nom, email, type_utilisateur, age, niveau } = userData;
    const [result] = await pool.query(
      'UPDATE Utilisateurs SET nom = ?, email = ?, type_utilisateur = ?, age = ?, niveau = ? WHERE utilisateur_id = ?',
      [nom, email, type_utilisateur, age, niveau, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;