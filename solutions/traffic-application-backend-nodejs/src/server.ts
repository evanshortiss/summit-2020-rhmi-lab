import * as express from 'express';
import * as env from 'env-var';
import log from './log';
import * as swaggerUi from 'swagger-ui-express';
import junctionsRoute from './routes/junctions';
import metersRoute from './routes/meters';
import { resolve } from 'path';

let swaggerJson;
try {
  swaggerJson = require('../openapi-spec.json');
} catch (e) {
  console.error(
    '\nERROR: please add your openapi-spec.json file to the root of the project\n'
  );
  process.exit(1);
}

const PORT = env
  .get('PORT')
  .default(8080)
  .asPortNumber();

const app = express();

// Add kubernetes liveness and readiness probes at
// /api/health/readiness and /api/health/liveness
require('kube-probe')(app);

// Include sensible security headers by default
app.use(require('helmet')());

// Apply CORS headers. Note this is insecure since it returns a *
// It's recommend you pass the hostnames you wish to allow use CORS
app.use(require('cors')());

// Log incoming requests
app.use(require('morgan')('combined'));

// We're returning a large amount of JSON, so compress it
app.use(require('compression')())

// Redirect to the api-docs by default
app.get('/', (req: express.Request, res: express.Response) => {
  res.redirect('/api-docs');
});

app.get('/openapi-spec.json', (req, res) => {
  res.setHeader('content-type', 'application/swagger+json')
  res.sendFile(resolve(__dirname, '../openapi-spec.json'))
})

// Setup an api-docs endpoint using swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

// Mount a /junctions and /meters endpoints
app.use('/junctions', junctionsRoute);
app.use('/meters', metersRoute);

app.listen(PORT, (err: any) => {
  if (err) {
    log.error('serve error', err);
    throw err;
  }

  log.info(`server listening on port ${PORT}`);
});
