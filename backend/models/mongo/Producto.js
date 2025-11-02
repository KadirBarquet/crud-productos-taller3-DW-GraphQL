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
        return nuevoProducto;
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

        return await ProductoModel.find(query).sort({ createdAt: -1 });
    }

    // Obtener por ID
    static async obtenerPorId(id) {
        const ProductoModel = mongoose.model('Producto', productoSchema);
        return await ProductoModel.findById(id);
    }

    // Actualizar
    static async actualizar(id, datos) {
        const ProductoModel = mongoose.model('Producto', productoSchema);
        return await ProductoModel.findByIdAndUpdate(
            id,
            datos,
            { new: true, runValidators: true }
        );
    }

    // Eliminar
    static async eliminar(id) {
        const ProductoModel = mongoose.model('Producto', productoSchema);
        return await ProductoModel.findByIdAndDelete(id);
    }
}

// Registrar modelo si no existe
if (!mongoose.models.Producto) {
    mongoose.model('Producto', productoSchema);
}

export default Producto;