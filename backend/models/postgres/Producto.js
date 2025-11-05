import { pool } from '../../config/postgresql.js';

class Producto {
    // Normalizar formato de producto para respuesta consistente
    static normalizarProducto(producto) {
        if (!producto) return null;

        return {
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: parseFloat(producto.precio),
            stock: parseInt(producto.stock),
            categoria: producto.categoria,
            activo: producto.activo,
            // Campos de PostgreSQL
            fecha_creacion: producto.fecha_creacion || null,
            fecha_actualizacion: producto.fecha_actualizacion || null,
            // Campos alias para compatibilidad con MongoDB
            createdAt: producto.fecha_creacion || null,
            updatedAt: producto.fecha_actualizacion || null
        };
    }

    // Crear producto
    static async crear(nombre, descripcion, precio, stock, categoria, activo = true) {
        const query = `
            INSERT INTO productos (nombre, descripcion, precio, stock, categoria, activo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await pool.query(query, [nombre, descripcion, precio, stock, categoria, activo]);
        return this.normalizarProducto(result.rows[0]);
    }

    // Obtener todos los productos con filtros opcionales
    static async obtenerTodos(filtros = {}) {
        let query = 'SELECT * FROM productos WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (filtros.activo !== undefined) {
            query += ` AND activo = $${paramCount}`;
            params.push(filtros.activo);
            paramCount++;
        }

        if (filtros.categoria) {
            query += ` AND categoria = $${paramCount}`;
            params.push(filtros.categoria);
            paramCount++;
        }

        query += ' ORDER BY fecha_creacion DESC';

        const result = await pool.query(query, params);
        return result.rows.map(p => this.normalizarProducto(p));
    }

    // Obtener producto por ID
    static async obtenerPorId(id) {
        const query = 'SELECT * FROM productos WHERE id = $1';
        const result = await pool.query(query, [id]);
        return this.normalizarProducto(result.rows[0]);
    }

    // Actualizar producto
    static async actualizar(id, datos) {
        const { nombre, descripcion, precio, stock, categoria, activo } = datos;

        const query = `
            UPDATE productos 
            SET nombre = COALESCE($1, nombre),
                descripcion = COALESCE($2, descripcion),
                precio = COALESCE($3, precio),
                stock = COALESCE($4, stock),
                categoria = COALESCE($5, categoria),
                activo = COALESCE($6, activo),
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `;

        const result = await pool.query(query, [
            nombre, descripcion, precio, stock, categoria, activo, id
        ]);

        return this.normalizarProducto(result.rows[0]);
    }

    // Eliminar producto
    static async eliminar(id) {
        const query = 'DELETE FROM productos WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return this.normalizarProducto(result.rows[0]);
    }
}

export default Producto;