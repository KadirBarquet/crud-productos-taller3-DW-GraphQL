import Usuario from '../../models/mongo/Usuario.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// POST: Registrar usuario
export const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        const usuarioExistente = await Usuario.buscarPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        const nuevoUsuario = await Usuario.crear(nombre, email, password);

        const token = jwt.sign(
            { id: nuevoUsuario.id, email: nuevoUsuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: { usuario: nuevoUsuario, token }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

// POST: Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y password son requeridos'
            });
        }

        const usuario = await Usuario.buscarPorEmail(email);
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const passwordValido = await Usuario.compararPassword(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        delete usuario.password;

        res.json({
            success: true,
            message: 'Login exitoso',
            data: { usuario, token }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

// GET: Perfil
export const perfil = async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorId(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};