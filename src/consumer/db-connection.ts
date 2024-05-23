import postgres from 'postgres';

const sql = postgres({
  host: 'localhost',
  port: 5444,
  database: 'tienda',
  username: 'postgres',
  password: 'postgres',
});

export default sql;
