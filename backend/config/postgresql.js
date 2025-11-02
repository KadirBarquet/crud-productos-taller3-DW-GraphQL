// CONEXIÓN CON POSTGRESQL
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.PG_USERNAME || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

export const connectPostgreSQL = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL conectado exitosamente');

    // Verificar si la tabla usuarios existe
    const checkUsuarios = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    const usuariosExiste = checkUsuarios.rows[0].exists;

    // Verificar si la tabla productos existe
    const checkProductos = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'productos'
      );
    `);
    const productosExiste = checkProductos.rows[0].exists;

    // Crear tabla de usuarios si no existe
    if (!usuariosExiste) {
      await client.query(`
        CREATE TABLE usuarios (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Tabla usuarios creada exitosamente');
    } else {
      console.log('Tabla usuarios ya existe');
    }

    // Crear tabla de productos si no existe
    if (!productosExiste) {
      await client.query(`
        CREATE TABLE productos (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(200) NOT NULL,
          descripcion TEXT NOT NULL,
          precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
          stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
          categoria VARCHAR(100) NOT NULL,
          activo BOOLEAN DEFAULT true,
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Tabla productos creada exitosamente');
    } else {
      console.log('Tabla productos ya existe');
    }

    // Mensaje final
    if (usuariosExiste && productosExiste) {
      console.log('Tablas de Usuarios y Productos ya estaban creadas');
    }

    client.release();
  } catch (error) {
    console.error('✗ Error al conectar PostgreSQL:', error.message);
    process.exit(1);
  }
}; 