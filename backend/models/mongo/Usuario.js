import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'El password es requerido'],
        minlength: [6, 'El password debe tener al menos 6 caracteres']
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'usuarios'
});

class Usuario {
    // Crear usuario
    static async crear(nombre, email, password) {
        const UsuarioModel = mongoose.model('Usuario', usuarioSchema);
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = new UsuarioModel({
            nombre,
            email,
            password: hashedPassword
        });

        await nuevoUsuario.save();

        return {
            id: nuevoUsuario._id.toString(),
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email,
            fecha_registro: nuevoUsuario.fecha_registro
        };
    }

    // Buscar por email
    static async buscarPorEmail(email) {
        const UsuarioModel = mongoose.model('Usuario', usuarioSchema);
        const usuario = await UsuarioModel.findOne({ email });

        if (!usuario) return null;

        return {
            id: usuario._id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            password: usuario.password,
            fecha_registro: usuario.fecha_registro
        };
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const UsuarioModel = mongoose.model('Usuario', usuarioSchema);
        const usuario = await UsuarioModel.findById(id);

        if (!usuario) return null;

        return {
            id: usuario._id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            fecha_registro: usuario.fecha_registro
        };
    }

    // Comparar password
    static async compararPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Listar todos los usuarios
    static async listarTodos() {
        const UsuarioModel = mongoose.model('Usuario', usuarioSchema);
        const usuarios = await UsuarioModel.find().sort({ fecha_registro: -1 });

        return usuarios.map(u => ({
            id: u._id.toString(),
            nombre: u.nombre,
            email: u.email,
            fecha_registro: u.fecha_registro
        }));
    }
}

// Registrar modelo si no existe
if (!mongoose.models.Usuario) {
    mongoose.model('Usuario', usuarioSchema);
}

export default Usuario;