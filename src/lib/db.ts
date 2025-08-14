const knex = require('knex');
import { development } from '../../db/knexfile';

// Create a single database connection instance
const db = knex(development);

export default db;