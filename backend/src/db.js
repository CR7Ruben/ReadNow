
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
  user: 'postgres',
  password: 'El_Gonzalez.0724',
  host: 'localhost',
  port: 5432,
  database: 'ReadNow'
});
export default pool;
