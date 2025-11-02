import { pool } from '../../config/postgresql.js';
import bcrypt from 'bcrypt';

class Usuario {
    // Crear usuario
    static async crear(nombre, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
      INSERT INTO usuarios (nombre, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, email, fecha_registro
    `;
        const result = await pool.query(query, [nombre, email, hashedPassword]);
        return result.rows[0];
    }

    // Buscar por email
    static async buscarPorEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const query = 'SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Comparar password
    static async compararPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Listar todos los usuarios
    static async listarTodos() {
        const query = 'SELECT id, nombre, email, fecha_registro FROM usuarios ORDER BY fecha_registro DESC';
        const result = await pool.query(query);
        return result.rows;
    }
}

export default Usuario;