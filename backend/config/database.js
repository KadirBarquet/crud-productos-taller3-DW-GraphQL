// PATRON FACTORY PARA CONECTAR BD SEGUN LA CONFIGURACION
// DB_ENGINE PUEDE SER 'postgres' O 'mongo'

import { connectMongoDB } from './mongodb.js';
import { connectPostgreSQL } from './postgresql.js';
import dotenv from 'dotenv';

dotenv.config();

export const connectDatabase = async () => {
    // En el env esta por default como DB_ENGINE=postgres pero se puede cambiar a mongo
    const dbEngine = process.env.DB_ENGINE || 'postgres';
    console.log(`\nMotor de BD seleccionado: ${dbEngine.toUpperCase()}`);

    switch (dbEngine.toLowerCase()) {
        case 'postgres':
            await connectPostgreSQL();
            break;
        case 'mongo':
            await connectMongoDB();
            break;
        default:
            console.error(`Motor de BD desconocido: ${dbEngine}`);
            console.log('Usa "postgres" o "mongo" en la variable DB_ENGINE');
            process.exit(1);
    }
};

//  Obtiene el motor de BD actual
export const getDBEngine = () => {
    const dbEngine = process.env.DB_ENGINE || 'postgres';
    return dbEngine;
}