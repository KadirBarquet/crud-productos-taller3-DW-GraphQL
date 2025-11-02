import Producto from '../../models/mongo/Producto.js';

// POST: Crear producto
export const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria, activo } = req.body;

        if (!nombre || !descripcion || precio === undefined || stock === undefined || !categoria) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const nuevoProducto = await Producto.crear(nombre, descripcion, precio, stock, categoria, activo);

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: nuevoProducto
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
};

// GET: Obtener todos
export const obtenerProductos = async (req, res) => {
    try {
        const { activo, categoria } = req.query;

        const filtros = {};
        if (activo !== undefined) filtros.activo = activo === 'true';
        if (categoria) filtros.categoria = categoria;

        const productos = await Producto.obtenerTodos(filtros);

        res.json({
            success: true,
            cantidad: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

// GET: Obtener por ID
export const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.obtenerPorId(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener producto',
            error: error.message
        });
    }
};

// PUT: Actualizar
export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        const producto = await Producto.actualizar(id, datos);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: producto
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto',
            error: error.message
        });
    }
};

// DELETE: Eliminar
export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.eliminar(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente',
            data: producto
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto',
            error: error.message
        });
    }
};