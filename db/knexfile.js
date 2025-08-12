import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables from the root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
    client: 'pg',
    connection: {
        host: process.env.NEXT_PUBLIC_PGHOST || process.env.PGHOST || 'localhost',
        user: process.env.NEXT_PUBLIC_PGUSER || process.env.PGUSER || 'postgres',
        password: process.env.NEXT_PUBLIC_PGPASSWORD || process.env.PGPASSWORD || 'postgres',
        database: process.env.NEXT_PUBLIC_PGDATABASE || process.env.PGDATABASE || 'formi_dev',
        port: parseInt(process.env.NEXT_PUBLIC_PGPORT || process.env.PGPORT || '5432'),
        ssl: (process.env.NEXT_PUBLIC_PGSSLMODE || process.env.PGSSLMODE) === 'require' ? { rejectUnauthorized: false } : false,
    },
    migrations: {
        directory: resolve(__dirname, 'migrations'),
    },
};