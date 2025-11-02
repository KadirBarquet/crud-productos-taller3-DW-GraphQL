import { getDBEngine } from '../../config/database.js';
import { GraphQLError } from 'graphql';

// Importar modelos dinámicamente según DB_ENGINE
const getProductoModel = async () => {
  const dbEngine = getDBEngine();
  if (dbEngine === 'mongo') {
    return (await import('../../models/mongo/Producto.js')).default;
  } else {
    return (await import('../../models/postgres/Producto.js')).default;
  }
};

export const productoResolvers = {
  Query: {
    // Obtener todos los productos
    productos: async (_, { filtros }, { user }) => {
      if (!user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const Producto = await getProductoModel();
        const filtrosObj = {};

        if (filtros) {
          if (filtros.activo !== undefined) filtrosObj.activo = filtros.activo;
          if (filtros.categoria) filtrosObj.categoria = filtros.categoria;
        }

        const productos = await Producto.obtenerTodos(filtrosObj);

        return {
          success: true,
          cantidad: productos.length,
          data: productos
        };
      } catch (error) {
        throw new GraphQLError('Error al obtener productos', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    // Obtener producto por ID
    producto: async (_, { id }, { user }) => {
      if (!user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const Producto = await getProductoModel();
        const producto = await Producto.obtenerPorId(id);

        if (!producto) {
          throw new GraphQLError('Producto no encontrado', {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        return {
          success: true,
          message: 'Producto encontrado',
          data: producto
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;

        throw new GraphQLError('Error al obtener producto', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  },

  Mutation: {
    // Crear producto
    crearProducto: async (_, { input }, { user }) => {
      if (!user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const { nombre, descripcion, precio, stock, categoria, activo } = input;

        // Validaciones
        if (!nombre || !descripcion || precio === undefined || stock === undefined || !categoria) {
          throw new GraphQLError('Todos los campos son requeridos', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        const Producto = await getProductoModel();
        const nuevoProducto = await Producto.crear(
          nombre,
          descripcion,
          precio,
          stock,
          categoria,
          activo !== undefined ? activo : true
        );

        return {
          success: true,
          message: 'Producto creado exitosamente',
          data: nuevoProducto
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;

        throw new GraphQLError('Error al crear producto', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    // Actualizar producto
    actualizarProducto: async (_, { id, input }, { user }) => {
      if (!user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const Producto = await getProductoModel();
        const producto = await Producto.actualizar(id, input);

        if (!producto) {
          throw new GraphQLError('Producto no encontrado', {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        return {
          success: true,
          message: 'Producto actualizado exitosamente',
          data: producto
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;

        throw new GraphQLError('Error al actualizar producto', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    // Eliminar producto
    eliminarProducto: async (_, { id }, { user }) => {
      if (!user) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const Producto = await getProductoModel();
        const producto = await Producto.eliminar(id);

        if (!producto) {
          throw new GraphQLError('Producto no encontrado', {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        return {
          success: true,
          message: 'Producto eliminado exitosamente',
          data: producto
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;

        throw new GraphQLError('Error al eliminar producto', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }
};