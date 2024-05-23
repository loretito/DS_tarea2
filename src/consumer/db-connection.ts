const postgres = require('postgres');

// Configuración de la conexión a la base de datos
const sql = postgres({
  host: 'localhost',
  port: 5444,
  database: 'tienda',
  username: 'postgres',
  password: 'postgres',
  onnotice: (notice) => {
    console.log(`Notice: ${notice.message}`);
  },
  debug: (connection, query, parameters) => {
    console.log(`Query: ${query}`);
    console.log(`Parameters: ${parameters}`);
  },
  onerror: (err) => {
    console.error(`Database error: ${err.message}`);
  }
});

export default sql;

// Función para verificar la conexión a la base de datos
const checkConnection = async () => {
  try {
    // Ejecutar una consulta simple para verificar la conexión
    const result = await sql`SELECT version()`;
    console.log('Conexión exitosa a la base de datos.');
    console.log('Versión de PostgreSQL:', result[0].version);

    // Información adicional sobre la conexión
    const connectionInfo = await sql`
      SELECT
        inet_server_addr() as server_ip,
        inet_server_port() as server_port,
        current_database() as database_name,
        current_user as user_name
    `;
    console.log('Información de la conexión:', connectionInfo[0]);

  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
};

// Llamar a la función para verificar la conexión
checkConnection();
