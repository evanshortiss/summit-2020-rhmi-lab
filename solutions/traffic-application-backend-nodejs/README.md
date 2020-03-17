# Red Hat Summit 2020 RHMI Lab Node.js API Server

This repository implements a Node.js API that fulfills the requirements for
the Meters and Junctions API portion of the lab.

## Running on OpenShift via Nodeshift
To use this method of deployment you'll need:

* Node.js v12 or later
* An OpenShift instance
* [OpenShift CLI(`oc`)](https://github.com/openshift/origin/releases/tag/v3.11.0)

Nodeshift is a neat CLI that simplifies deployment of Node.js applications on
OpenShift. This project incldues Nodeshift in `devDependencies` so you can
simply run the following to deploy it on an OpenShift instance:

```
$ git clone https://github.com/evanshortiss/summit-2020-rhmi-lab node-js-api

$ cd solutions/traffic-application-backend-nodejs

# Ensure you are logged into your openshift instance
$ oc login $OPENSHIFT_URL

# Choose the project you'd like to deploy this application into
# Use "oc projects" to list available projects
$ oc project $YOUR_PROJECT

# Build and deploy on OpenShift
$ npm run nodeshift
```

## Running Locally without Docker
To run this application locally you'll need:

* Node.js v12 or later
* npm v6 or later
* Git

Clone the project locally and run the following commands to start the program
locally after cloning it:

```
$ npm install
$ npm start
```

If you're developing locally you automated code watching and reloading via:

```
npm run start-dev
```

## Running Locally using Docker and s2i
To perform the following steps you'll need:

* [Docker](https://docs.docker.com/release-notes/) (v17.x tested)
* [s2i](https://github.com/openshift/source-to-image/releases) (v1.1.7 tested)

With both tools installed you can execute the following commands from this
folder to run your application locally in an environment that's similar to the
one that it will use when deployed on OpenShift.

```
# Build the latest local commit into a container image
$ ./scripts/image.build.sh

# Run our container image
$ docker run -p 8080:8080 -dit --name summit-2020-rhmi-lab-nodejs-backend
```

This instructs `s2i` to build our source code into an image that will be tagged
as "nodejs-api-server". The base image used the official Red Hat Node.js v10 image.
Once the build is complete we run it using Docker and expose its port 8080 to
our local port 8080.
