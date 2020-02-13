# Red Hat Summit 2020 RHMI Lab UI

This is a UI to render results fetched from the Junction & Parking Meters API
deployed as part of the Red Hat Summit 2020 RHMI Lab.

This repository is utilises Patternfly 4 for building the UI. It was generated
from the  on the [Patternfly React Seed](https://github.com/patternfly/patternfly-react-seed).

## Quickstart Development Server

The following steps will launch a development server that serves the frontend
on `http://localhost:9000`. This also includes endpoints to fetch meter and
junction data using `http://localhost:9000/meters` and
`http://localhost:9000/junctions`.

```bash
# ensure you have yarn installled globally
# if you run into issues use "yarn@1.21.0" since this works 
npm install yarn -g

# clone the project (if developing locally)
git clone git@github.com:evanshortiss/summit-2020-rhmi-lab.git

# navigate into this directory
cd summit-2020-rhmi-lab/solutions/traffic-application-frontend

# install dependencies
yarn

# set a google maps api key
export MAPS_API_KEY=ValidApiKeyGoesHere

# start the development server
yarn start:dev
```

## Development Scripts

Install development/build dependencies
`yarn`

Start the development server
`yarn start:dev`

Run a production build
`MAPS_API_KEY=$YOUR_GMAPS_API_KEY yarn build`

Run the test suite
`yarn test`

Run the linter
`yarn lint`

Run the code formatter
`yarn format`

Launch a tool to inspect the bundle size
`yarn bundle-profile:analyze`

## Deployment

You can deploy this using the Node.js s2i builder. This will invoke the
`yarn build` script, then use the `server.js` when running on OpenShift.

When performing a build the `MAPS_API_KEY` environment variable needs to
set in the build container.

## Configurations
* [TypeScript Config](./tsconfig.json)
* [Webpack Config](./webpack.common.js)
* [Jest Config](./jest.config.js)
* [Editor Config](./.editorconfig)

## Code Quality Tools
* For accessibility compliance, we use [react-axe](https://github.com/dequelabs/react-axe)
* To keep our bundle size in check, we use [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
* To keep our code formatting in check, we use [prettier](https://github.com/prettier/prettier)
* To keep our code logic and test coverage in check, we use [jest](https://github.com/facebook/jest)
