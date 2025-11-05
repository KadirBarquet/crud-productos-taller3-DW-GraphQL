import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio debe ser mayor o igual a 0']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es requerido'],
        min: [0, 'El stock debe ser mayor o igual a 0'],
        default: 0
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es requerida'],
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'producto'
});

class Producto {
    // Normalizar formato de producto para respuesta consistente
    static normalizarProducto(producto) {
        if (!producto) return null;

        return {
            id: producto._id.toString(),
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
            categoria: producto.categoria,
            activo: producto.activo,
            // Campos de MongoDB (timestamps)
            createdAt: producto.createdAt || null,
            updatedAt: producto.updatedAt || null,
            // Campos alias para compatibilidad con PostgreSQL
            fecha_creacion: producto.createdAt || null,
            fecha_actualizacion: producto.updatedAt || null
        };
    }

    // Crear producto
    static async crear(nombre, descripcion, precio, stock, categoria, activo = true) {
        const ProductoModel = mongoose.model('Producto', productoSchema);

        const nuevoProducto = new ProductoModel({
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            activo
        });

        await nuevoProducto.save();
        return this.normalizarProducto(nuevoProducto);
    }

    // Obtener todos con filtros
    static async obtenerTodos(filtros = {}) {
        const ProductoModel = mongoose.model('Producto', productoSchema);
        const query = {};

        if (filtros.activo !== undefined) {
            query.activo = filtros.activo;
        }

        if (filtros.categoria) {
            query.categoria = filtros.categoria;
        }

        const productos = await ProductoModel.find(query).sort({ createdAt: -1 });
        return productos.map(p => this.normalizarProducto(p));
    }

    // Obtener por ID
    static async obtenerPorId(id) {
        const ProductoModel = mongoose.model('Producto', productoSchema);
        const producto = await ProductoModel.findById(id);
        return this.normalizarProducto(producto);
    }

    // Actualizar
    static async actualizar(id, datos) {
        const ProductoModel = mongoose.model('Producto', productoSchema);
        const producto = await ProductoModel.findByIdAndUpdate(
            id,
            datos,
            { new: true, runValidators: true }
        );
        return this.normalizarProducto(producto);
    }

    // Eliminar
    static async eliminar(id) {
        const ProductoModel = mongoose.model('Producto', productoSchema);
        const producto = await ProductoModel.findByIdAndDelete(id);
        return this.normalizarProducto(producto);
    }
}

// Registrar modelo si no existe
if (!mongoose.models.Producto) {
    mongoose.model('Producto', productoSchema);
}

export default Producto;