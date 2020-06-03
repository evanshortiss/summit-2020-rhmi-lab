NUM_USERS="${NUM_USERS:-10}"
DEV_USERNAME="${DEV_USERNAME:-evals}"
FUSE_NAMESPACE="${FUSE_NAMESPACE:-redhat-rhmi-fuse}"
FUSE_OPERATOR_NAMESPACE="${FUSE_OPERATOR_NAMESPACE:-redhat-rhmi-fuse-operator}"

NUM_FORMAT=${#NUM_USERS}
if [ $NUM_FORMAT -eq 1 ]; then
  NUM_FORMAT=2
fi
USERNAME_TEMPLATE="${DEV_USERNAME}%0${NUM_FORMAT}d"

create_fuse_resources() {
  USERNAME=$(printf ${USERNAME_TEMPLATE} $1)
  NAMESPACE="${USERNAME}-fuse"

  # Create and switch to user fuse project
  oc create namespace $NAMESPACE
  oc label namespace $NAMESPACE integreatly=true user-fuse-online=true

  # Create fuse pull secret
  oc get secret syndesis-pull-secret -n $FUSE_NAMESPACE -o yaml | sed '/namespace:/d' | oc create -n $NAMESPACE -f -

  # Give user view permission to the namespace
  oc create rolebinding $USERNAME-view --clusterrole="view" --user=$USERNAME -n $NAMESPACE

  # Create catalog source
  oc get configmap registry-cm-redhat-rhmi-fuse-operator -n $FUSE_OPERATOR_NAMESPACE -o yaml | sed "/namespace: $FUSE_OPERATOR_NAMESPACE/d" | oc create -n $NAMESPACE -f -
  oc get catalogsource rhmi-registry-cs -n $FUSE_OPERATOR_NAMESPACE -o yaml | sed '/namespace:/d' | oc create -n $NAMESPACE -f -
  sleep 20

  until [[ $(oc get catalogsource rhmi-registry-cs -n $NAMESPACE -o jsonpath='{.status.connectionState.lastObservedState}' | awk -F\. '{print $1}') == "READY" ]]; do
    echo "waiting for catalog source in $NAMESPACE namespace to be ready"
    sleep 30
  done

  # Create operator group
  oc process -p USER_FUSE_NAMESPACE=$NAMESPACE -f "${BASH_SOURCE%/*}/templates/fuse-operator-group.yaml" | oc create -f -

  # Create subscription
  oc process -p USERNAME=$USERNAME USER_FUSE_NAMESPACE=$NAMESPACE -f "${BASH_SOURCE%/*}/templates/fuse-subscription.yaml" | oc create -f -
  sleep 20

  # Ensure install plan exists before proceeding
  until [[ $(oc get installplans -n $NAMESPACE --ignore-not-found=true | grep -v NAME | wc -l) -eq 1 ]]; do
    echo "waiting for installplan to become available in $NAMESPACE"
    sleep 10
  done

  # Approve install plan
  oc patch installplan $(oc get installplans -n $NAMESPACE | grep -v NAME | awk '{print $1}') -n $NAMESPACE --type='json' -p '[{"op": "replace", "path": "/spec/approved", "value": true}]'

  # Get 3Scale management URL
  THREESCALE_MGMT_URL=$(oc get syndesis integreatly -n redhat-rhmi-fuse -o yaml | grep managementUrlFor3scale | awk '{print $2}')

  # Create the Syndesis CR
  oc process -p FUSE_CR_NAME=$USERNAME USER_FUSE_NAMESPACE=$NAMESPACE THREESCALE_MANAGEMENT_URL=$THREESCALE_MGMT_URL -f "${BASH_SOURCE%/*}/templates/fuse.yaml" | oc create -f -
}

for ((i = 1; i <= NUM_USERS; i++)); do
  sleep 10
  create_fuse_resources $i &
done

wait

# Check installations status
# watch "oc get syndesis --all-namespaces | grep -v Installed | grep -v NAMESPACE"

echo "Checking Fuse Online installation status"
until [[ $(oc get syndesis --all-namespaces | grep -v Installed | grep -v NAMESPACE | wc -l) -eq 0 ]]; do
  NUM_REMAINING_INSTALLATIONS=$(oc get syndesis --all-namespaces | grep -v Installed | grep -v NAMESPACE | wc -l)
  echo "There are $NUM_REMAINING_INSTALLATIONS installations still in progress"
  sleep 60
done
echo "Fuse Online installation has completed for $NUM_USERS users"
