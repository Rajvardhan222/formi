import knex from 'knex';
import { development } from '../../db/knexfile.js';

// Create a single database connection instance
const db = knex(development);

export default db;