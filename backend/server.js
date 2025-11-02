import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { connectDatabase, getDBEngine } from './config/database.js';
import { schema } from './graphql/index.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos seleccionada
await connectDatabase();

// Importar rutas REST dinámicamente después de conectar BD
const authRoutes = (await import('./routes/authRoutes.js')).default;
const productoRoutes = (await import('./routes/productoRoutes.js')).default;

// Usar rutas REST (mantener compatibilidad)
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// Configurar Apollo Server con GraphQL
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => {
    // Obtener token del header
    const token = req.headers.authorization?.split(' ')[1] || '';

    // Verificar token si existe
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.log('Token inválido o expirado');
      }
    }

    return { user };
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      path: error.path
    };
  }
});

// Iniciar Apollo Server
await apolloServer.start();
apolloServer.applyMiddleware({ 
  app, 
  path: '/graphql',
  cors: {
    origin: '*',
    credentials: true
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  const dbEngine = getDBEngine();

  res.json({
    success: true,
    message: 'API funcionando correctamente',
    version: '2.0.0 - REST + GraphQL',
    database: dbEngine.toLowerCase(),
    endpoints: {
      graphql: {
        playground: `http://localhost:${PORT}/graphql`,
        endpoint: `http://localhost:${PORT}/graphql`
      },
      rest: {
        auth: {
          registro: 'POST /api/auth/registro',
          login: 'POST /api/auth/login',
          perfil: 'GET /api/auth/perfil (requiere token)'
        },
        productos: {
          crear: 'POST /api/productos (requiere token)',
          listar: 'GET /api/productos (requiere token)',
          obtener: 'GET /api/productos/:id (requiere token)',
          actualizar: 'PUT /api/productos/:id (requiere token)',
          eliminar: 'DELETE /api/productos/:id (requiere token)'
        }
      }
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  const dbEngine = getDBEngine();
  console.log(`\nServidor corriendo en puerto ${PORT}`);
  console.log(`- REST API: http://localhost:${PORT}`);
  console.log(`- GraphQL Playground: http://localhost:${PORT}/graphql`);
  console.log(`- Base de datos activa: ${dbEngine}`);
  console.log(`- Documentación: http://localhost:${PORT}\n`);
});