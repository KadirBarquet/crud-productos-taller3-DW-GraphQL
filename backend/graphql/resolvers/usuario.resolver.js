import jwt from 'jsonwebtoken';
import { getDBEngine } from '../../config/database.js';
import { GraphQLError } from 'graphql';

// Importar modelos dinámicamente según DB_ENGINE
const getUsuarioModel = async () => {
  const dbEngine = getDBEngine();
  if (dbEngine === 'mongo') {
    return (await import('../../models/mongo/Usuario.js')).default;
  } else {
    return (await import('../../models/postgres/Usuario.js')).default;
  }
};

export const usuarioResolvers = {
  Query: {
    // Obtener perfil del usuario autenticado
    perfil: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const Usuario = await getUsuarioModel();
        const usuario = await Usuario.buscarPorId(user.id);

        if (!usuario) {
          throw new GraphQLError('Usuario no encontrado', {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        return usuario;
      } catch (error) {
        throw new GraphQLError('Error al obtener perfil', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    // Listar todos los usuarios
    usuarios: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const Usuario = await getUsuarioModel();
        return await Usuario.listarTodos();
      } catch (error) {
        throw new GraphQLError('Error al obtener usuarios', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  },

  Mutation: {
    // Registro de usuario
    registro: async (_, { nombre, email, password }) => {
      try {
        // Validaciones
        if (!nombre || !email || !password) {
          throw new GraphQLError('Todos los campos son requeridos', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        if (password.length < 6) {
          throw new GraphQLError('La contraseña debe tener al menos 6 caracteres', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        const Usuario = await getUsuarioModel();

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.buscarPorEmail(email);
        if (usuarioExistente) {
          throw new GraphQLError('El email ya está registrado', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        // Crear usuario
        const nuevoUsuario = await Usuario.crear(nombre, email, password);

        // Generar token
        const token = jwt.sign(
          { id: nuevoUsuario.id, email: nuevoUsuario.email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return {
          success: true,
          message: 'Usuario registrado exitosamente',
          usuario: nuevoUsuario,
          token
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;

        throw new GraphQLError('Error al registrar usuario', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    // Login de usuario
    login: async (_, { email, password }) => {
      try {
        // Validaciones
        if (!email || !password) {
          throw new GraphQLError('Email y password son requeridos', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        const Usuario = await getUsuarioModel();

        // Buscar usuario
        const usuario = await Usuario.buscarPorEmail(email);
        if (!usuario) {
          throw new GraphQLError('Credenciales inválidas', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }

        // Verificar password
        const passwordValido = await Usuario.compararPassword(password, usuario.password);
        if (!passwordValido) {
          throw new GraphQLError('Credenciales inválidas', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }

        // Generar token
        const token = jwt.sign(
          { id: usuario.id, email: usuario.email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Eliminar password del objeto
        delete usuario.password;

        return {
          success: true,
          message: 'Login exitoso',
          usuario,
          token
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;

        throw new GraphQLError('Error al iniciar sesión', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }
};