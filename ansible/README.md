# Summit 2020 RHMI Lab Deployment

Use this Ansible project to deploy this lab.

## Prerequisites

The following should be installed on the machine used to deploy the lab:

* OpenShift (`oc`) CLI v4.x or later
* Ansible CLI 2.7.6 or later
* JQ CLI v1.6 or later

You also need:

* An RHMI v2 Cluster
* AMQ Streams Operator installed on the RHMI v2 Cluster
* Admin (e.g kube:admin) account for the OpenShift v4 Cluster

## Deployment Instructions 

Next, run the command below in this folder to deploy the lab for 50 users. By default
50 users will be deployed if `lab_user_count` is not specified.

```bash
ansible-playbook playbooks/install.yml \
# The token and server URL can be obtained by logging in to the 
# OpenShift Console and choosing "Copy Login Command" from the
# menu in the top right corner
-e oc_login_token=<CLUSTER_API_TOKEN> \
-e oc_login_server=<CLUSTER_API_URL> \
-e lab_user_count=50 \
-e repo_root="$(pwd)/.."
```

If you are already targeting the OpenShift cluster with `oc`, you can run:

```bash
ansible-playbook playbooks/install.yml \
-e oc_login_token=$(oc whoami -t) \
-e oc_login_server=$(oc get infrastructure cluster -o jsonpath='{.status.apiServerURL}') \
-e lab_user_count=50 \
-e repo_root="$(pwd)/.."
```

Once this has completed you can login as `evals1` thru `evals50`.

## Uninstall Instructions

Same as deployment, but use the `uninstall.yml` playbook.

```bash
ansible-playbook playbooks/uninstall.yml \
-e oc_login_token=<CLUSTER_API_TOKEN> \
-e oc_login_server=<CLUSTER_API_URL> \
-e lab_user_count=60 \
-e repo_root="$(pwd)/.."
```

## Verify the Deployment

Login as a kubeadmin user and verify that the `city-of-losangeles` project exists.

Next, connect to the database Pod on OpenShift in the `city-of-losangeles`
project:

```bash
POSTGRES_POD=$(oc get pods -o json | jq -r '.items[0].metadata.name')
oc rsh $POSTGRES_POD
```

Use the following to test the database from the rsh session:

```bash
# Connect to postgres as an evals user, password is "Password1"
psql -U evals01 -d city-info -W
```

Query and try update the database. Update should return an error.

```sql
-- Should list results with id, name, lat, and long
select * from junction_info;

-- Should list results with id, address, lat, and long
select * from meter_info;

-- Should fail since evals users do not have write access to the city-info db
UPDATE meter_info SET address='oops' WHERE id=0;
```

After this try login as a lab user using the `rhmi-lab-htpasswd` option on the
OpenShift login screen and credential such as as `evals01` and the password
`evals01-password`.

## Managing the Lab

Some key points.

1. You must configure the `iot-data-generator` to send data to Kafka since it defaults to simply logging to stdout. Do this via `oc set env dc/summit-2020-rhmi-lab-data-generator TRANSPORT_MODE=kafka -n city-of-losangeles`. You can set it back to `console` (the default) if you need to limit data generation.
2. Kafka Integrations in Fuse will ignore old data in topics. This means you cannot simply preload the topics with data then set `TRANSPORT_MODE` back to `console`.
3. To login to Postgres as an admin use `psql -U rh-summit-admin -d city-info -W` and the password set in the Ansible script that deployed the DB.
