import * as express from 'express';
import * as env from 'env-var';
import { createValidator } from 'express-joi-validation';
import * as Joi from '@hapi/joi';
import { query } from '../db';

const user = env
  .get('PG_USERNAME')
  .required()
  .example('evals01')
  .asString();

const validator = createValidator();
const metersRoute = express.Router();

const allMetersQuerySchema = Joi.object({
  user_key: Joi.string(),
  status: Joi.string().valid(
    'available',
    'out-of-service',
    'unknown',
    'occupied'
  )
});
const singleMeterQuerySchema = Joi.object({
  user_key: Joi.string(),
  meterId: Joi.number()
    .integer()
    .required()
    .positive()
});

// Fetch Latest Meter Statuses for all meters, or for a given status
metersRoute.get(
  '/',
  validator.query(allMetersQuerySchema),
  async (req, res, next) => {
    try {
      const status = req.query.status;

      let result;

      if (!status) {
        result = await query(
          `SELECT meter_info.latitude, meter_info.longitude, meter_info.address, latest_updates.meter_id, latest_updates.last_updated, meter_status_${user}.status_text FROM (SELECT meter_id, MAX(timestamp) as last_updated FROM meter_status_${user} GROUP BY meter_id) AS latest_updates INNER JOIN meter_info ON meter_info.id = latest_updates.meter_id INNER JOIN meter_status_${user} ON meter_info.id = meter_status_${user}.meter_id AND latest_updates.last_updated = meter_status_${user}.timestamp;`
        );
      } else {
        result = await query(
          `SELECT meter_status_${user}.status_text, meter_info.latitude, meter_info.address, meter_info.longitude, latest_updates.meter_id, latest_updates.last_updated FROM (SELECT meter_id, MAX(timestamp) as last_updated FROM meter_status_${user} GROUP BY meter_id) AS latest_updates INNER JOIN meter_info ON meter_info.id=latest_updates.meter_id INNER JOIN meter_status_${user} ON meter_status_${user}.meter_id=latest_updates.meter_id AND latest_updates.last_updated=meter_status_${user}.timestamp WHERE meter_status_${user}.status_text=$1;`,
          [status]
        );
      }

      res.json(result.rows);
    } catch (e) {
      next(e);
    }
  }
);

// Fetch Latest Status for Meter by Meter ID
metersRoute.get(
  '/:meterId',
  validator.params(singleMeterQuerySchema),
  async (req, res, next) => {
    try {
      const ret = await query(
        `SELECT * FROM(SELECT meter_id, timestamp as last_updated, status_text FROM meter_status_${user} WHERE meter_id=$1 ORDER BY last_updated DESC LIMIT 1) as latest_update INNER JOIN meter_info ON meter_info.id = $2;`,
        [req.params.meterId, req.params.meterId]
      );

      res.json(ret.rows);
    } catch (e) {
      next(e);
    }
  }
);

export default metersRoute;
