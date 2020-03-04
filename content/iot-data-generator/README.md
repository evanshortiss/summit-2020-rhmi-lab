# Red Hat Summit 2020 IoT Data Generator

This Node.js application generates data for attendees of the lab to consume
and operate on. 

_NOTE: By default data is written to stdout. To write data to Kafka for the lab users to consume you must set `TRANSPORT_MODE=kafka` *Environment Variable* in the *DeploymentConfig*_

### Strategy

1. Once per minute an "update" function is executed
1. This updates the state of each parking meter and junction
1. The new state is flushed to a "transport"

Currently this generates a large volume of data. We can revise this to reduce
the total number of meters, junctions, and the update frequency.

### Data Structures

Generates Meter and Junction payloads that conform to the spec
described in */data/lab-data-structures*.

The parking meter "status" field in payloads are weighted such that the
following states and probabilities are possible for meters:

* ~50% occupied
* ~20% available
* ~20% unknown
* ~10% out-of-service

Similarly, junctions are assigned a weight on initialisation to simulate the
idea that some intersections are busier than others.

### Transports

Data can be written to the following:

* AMQ Streams (Kafka) Topics
* PostgreSQL Tables
* AMQP (provided by AMQ Online)
* stdout/console (default)

Configure this by setting a `TRANSPORT_MODE` environment variable.

## Requirements

* Node.js 12+
* Docker 19+
* OpenShift (`oc`) CLI 4.x

## Configuration

* `TRANSPORT_MODE` - Set to `kafka`, `psql`, `amqp` or `console`. Defaults to
`console`.
* `PG_CONNECTION_STRING` - If `TRANSPORT_MODE` is set to `psql` this will be
used to connect to PostgreSQL. Defaults to `postgresql://rh-summit-admin:changethistosomethingelse@postgresql.city-of-losangeles.svc.cluster.local:5432/city-info`

## Run Locally with Node.js

Run the following from this directory (the one containing a *package.json*):

```bash
npm install
npm start
```

The generator will begin to print data on the console by default.

## Deploy to OpenShift

### Using an Image from Quay.io 
If you want to deploy the generator using a pre-built image run the following:

```
oc new-app quay.io/evanshortiss/summit-2020-rhmi-lab-data-generator
```

## Deploy to OpenShift via Nodeshift
Running the following will deploy the project into the `city-of-losangeles`
namespace.

```bash
oc login $CLUSTER_HOST -u admin
npm install
npm run nodeshift
```

## Docker Build & Push

To build and push a new image you can use the included scripts:

```
npm run image:build
npm run image:push
```
