# Summit 2020 RHMI Lab Deployment

Use this Ansible project to deploy this lab.

## Prerequisites

The following should be installed on the machine used to deploy the lab:

* RHMI v2 Cluster
* OpenShift (`oc`) CLI v4.x or later
* Ansible CLI 2.7.6 or later
* JQ CLI v1.6 or later
* Admin account for the OpenShift v4 Cluster

## Deployment Instructions

Run the command below in this folder to deploy the lab for 75 users. By default
75 users will be deployed if `lab_user_count` is not specified.

```bash
ansible-playbook playbooks/install.yml \
# The token and server URL can be obtained by logging in to the 
# OpenShift Console and choosing "Copy Login Command" from the
# menu in the top right corner
-e oc_login_token=Dfup9YoONYOx4wr6kRmP7Tc8vjSATf42_Hp3-SRXNYI \
-e oc_login_server=https://api.summit.cloudservices.rhmw.io:6443 \
-e lab_user_count=75
```

## Uninstall Instructions

Same as deployment, but use the `uninstall.yml` playbook.

```bash
ansible-playbook playbooks/uninstall.yml \
-e oc_login_token=Dfup9YoONYOx4wr6kRmP7Tc8vjSATf42_Hp3-SRXNYI \
-e oc_login_server=https://api.summit.cloudservices.rhmw.io:6443 \
-e lab_user_count=75
```
