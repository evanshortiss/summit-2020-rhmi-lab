import * as express from 'express';
import * as env from 'env-var';
import { query } from '../db';

const user = env
  .get('PG_USERNAME')
  .required()
  .example('evals01')
  .asString();

const junctionsRoute = express.Router();

// Fetch latest status for all junctions
junctionsRoute.get('/', async (req, res) => {
  const ret = await query(`SELECT latest_updates.junction_id, latest_updates.last_updated, junction_info.junction_name, junction_info.latitude, junction_info.longitude,
    junction_status_${user}.count_ns,
    junction_status_${user}.count_ew
    FROM
      (SELECT
        junction_id, MAX(timestamp) as last_updated
      FROM
        junction_status_${user}
      GROUP BY
        junction_id) AS latest_updates
    INNER JOIN junction_info
    ON junction_info.id=latest_updates.junction_id
    INNER JOIN junction_status_${user}
    ON junction_status_${user}.junction_id=latest_updates.junction_id AND junction_status_${user}.timestamp=latest_updates.last_updated;`);

  res.json(ret.rows);
});

export default junctionsRoute;
