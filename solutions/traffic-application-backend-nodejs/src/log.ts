import * as env from 'env-var';
import * as pino from 'pino';

const LOG_LEVEL = env
  .get('LOG_LEVEL')
  .default('debug')
  .example(Object.keys(pino.levels.values).join(', '))
  .asEnum(Object.keys(pino.levels.values));

const log = pino({
  level: LOG_LEVEL
});

export default log;
