import { Logger } from '@nestjs/common';
const postgres = require('postgres');

// Configuración de la conexión a la base de datos
const sql = postgres({
  host: 'localhost',
  port: 5444,
  database: 'tienda',
  username: 'postgres',
  password: 'postgres',
  onnotice: (notice) => {
    Logger.log(`Notice: ${notice.message}`);
  },
  onerror: (err) => {
    Logger.error(`Database error: ${err.message}`);
  }
});

export default sql;

// Función para verificar la conexión a la base de datos
const checkConnection = async () => {
  try {
    // Ejecutar una consulta simple para verificar la conexión
    await sql`SELECT version()`;
    Logger.log('Connection successful to database 🗃️');
  } catch (error) {
    Logger.error('Error al conectar a la base de datos:', error.message);
  }
};

// Función para buscar un producto por ID
export const findProductById = async (productId: number) => {
  try {
    const result = await sql`
      SELECT * FROM "order" WHERE bd_id = ${productId}
    `;
    Logger.log(`Producto encontrado en la base de datos: ${result}`);
    return result.length ? result[0] : null;
  } catch (error) {
    Logger.error('Error al buscar el producto en la base de datos:', error.message);
    throw error;
  }
};

// Llamar a la función para verificar la conexión
checkConnection();
