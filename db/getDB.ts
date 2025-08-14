import knex, { Knex } from 'knex';

let _db: Knex | undefined;
const getDb = (): Knex => {
  if (!_db) {
    _db = knex({
      client: 'pg',
      connection: {
         host: process.env.NEXT_PUBLIC_PGHOST || process.env.PGHOST || 'localhost',
        user: process.env.NEXT_PUBLIC_PGUSER || process.env.PGUSER || 'postgres',
        password: process.env.NEXT_PUBLIC_PGPASSWORD || process.env.PGPASSWORD || 'postgres',
        database: process.env.NEXT_PUBLIC_PGDATABASE || process.env.PGDATABASE || 'formi_dev',
        port: parseInt(process.env.NEXT_PUBLIC_PGPORT || process.env.PGPORT || '5432'),
        ssl: (process.env.NEXT_PUBLIC_PGSSLMODE || process.env.PGSSLMODE) === 'require' ? { rejectUnauthorized: false } : false,
      },
    });
  }
  return _db;
};

export default getDb;