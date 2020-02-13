import { Pool } from 'pg';
import * as env from 'env-var';
import log from './log';
import { SqlStatement } from '@nearform/sql';

const PG_DATABASE = env
  .get('PG_DATABASE')
  .default('city-info')
  .asString();

const PG_HOSTNAME = env
  .get('PG_HOSTNAME')
  .default('postgresql.city-of-losangeles.svc')
  .asString();

const PG_USERNAME = env
  .get('PG_HOSTNAME')
  .required()
  .example('evals01')
  .asString();

const PG_PASSWORD = env
  .get('PG_PASSWORD')
  .required()
  .example('Password1')
  .asString();

const connectionString = `postgresql://${PG_USERNAME}:${PG_PASSWORD}@${PG_HOSTNAME}:5432/${PG_DATABASE}`;

const pool = new Pool({ connectionString });

/**
 * Performs a database query and returns the resulting rows.
 * You can use a RowType generic to get types for returned rows.
 * @param sql
 * @param params
 */
export async function query<RowType>(sql: SqlStatement) {
  log.debug('query sql:%s', sql);

  const client = await pool.connect();
  const response = await client.query<RowType>(sql);

  client.release();

  return response;
}
