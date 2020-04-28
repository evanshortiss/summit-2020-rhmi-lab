## User Fuse Online Installation
### Prerequisite
- RHMI 2.x installed on the cluster
- [oc cli](https://docs.openshift.com/container-platform/4.3/cli_reference/openshift_cli/getting-started-cli.html#installing-the-cli)

### Usage

**IMPORTANT**: Each fuse online installation uses 3Gi of persistent volume storage. Ensure that the cluster resource quota for `resources.storage` allows for the amount of storage required by fuse online installations that you're about to create.

```
DEV_USERNAME=evals NUM_USERS=40 ./user-fuse-installation.sh
```

Optional Parameters:
  - **DEV_USERNAME**: The username format of a developer user. Default value is `evals`.
  - **NUM_USERS**: The number of developer users to create additional fuse online installations for. Default value is `10`.
  - **FUSE_NAMESPACE**: The managed shared fuse product namespace. Default value is `redhat-rhmi-fuse`.
  - **FUSE_OPERATOR_NAMESPACE**: The managed shared fuse operator namespace. Default value is `redhat-rhmi-fuse-operator`.

## User Fuse Online Uninstallation
Once the user fuse online installations are no longer needed, they can be cleaned up by running the uninstallation script.

```
DEV_USERNAME=evals ./user-fuse-cleanup.sh
```

Optional Parameters:
    - **DEV_USERNAME**: The username format of a developer user. Default value is `evals`.

## Updating the Solution Explorer
The solution explorer walkthroughs currently links to the managed shared fuse online console. In order to point to the per user fuse online console within the walkthroughs, the solution explorer deployment image needs to be updated to **quay.io/pb82/tutorial-web-app:summit**. 

**IMPORTANT**: Before updating the deployment, ensure that the solution explorer operator is not running as this will reconcile the solution explorer deployment back to using its original image. 




