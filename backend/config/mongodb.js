// CONEXIÓN CON MONGODB ATLAS 
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const db = process.env.MONGODB_DB;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: db
    });
    console.log('MongoDB Atlas conectado exitosamente');

    // Obtener la conexión activa
    const connection = mongoose.connection;

    // Listar todas las colecciones existentes
    const collections = await connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    // Verificar si existen las colecciones
    const usuariosExiste = collectionNames.includes('usuarios');
    const productoExiste = collectionNames.includes('producto');

    // Mostrar estado de las colecciones
    if (usuariosExiste && productoExiste) {
      console.log('Colecciones "usuarios" y "producto" ya estaban creadas');
    } else if (!usuariosExiste && !productoExiste) {
      console.log('Colecciones "usuarios" y "producto" se crearán al insertar el primer documento');
    } else {
      if (usuariosExiste) {
        console.log('Colección "usuarios" ya existe');
      } else {
        console.log('Colección "usuarios" se creará al insertar el primer documento');
      }

      if (productoExiste) {
        console.log('Colección "producto" ya existe');
      } else {
        console.log('Colección "producto" se creará al insertar el primer documento');
      }
    }

    // Mostrar información adicional (opcional)
    if (collectionNames.length > 0) {
      console.log(`Total de colecciones en la BD: ${collectionNames.length}`);
    }

  } catch (error) {
    console.error('✗ Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};