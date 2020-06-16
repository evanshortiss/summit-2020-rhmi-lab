PASSWORD=${PASSWORD:-summitpass2020}
NAMESPACE=${NAMESPACE:-redhat-rhmi-rhsso}
REALM=${REALM:-testing-idp}
REGULAR_USERNAME=${REGULAR_USERNAME:-evals}
NUM_REGULAR_USER=${NUM_REGULAR_USER:-70}

# make this the current working dir (easier template reference)
PWD=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# target the SSO namespace
oc project $NAMESPACE

format_user_name() {
  USER_NUM=$(printf "%02d" "$1") # Add leading zero to number
  USERNAME="$2$USER_NUM"         # Username combination of passed in username and number
}

# Delete existing testing-idp users
oc delete keycloakuser $(oc get keycloakuser -n $NAMESPACE | awk '/evals/ {print $1}' | xargs) -n $NAMESPACE
oc delete user $(oc get users | awk '/evals/ {print $1}' | xargs)
sleep 5

for ((i = 1; i <= NUM_REGULAR_USER; i++)); do
  format_user_name $i "$REGULAR_USERNAME"
  oc process -p NAMESPACE="$NAMESPACE" -p REALM="$REALM" -p PASSWORD="$PASSWORD" -p USERNAME="$USERNAME" -p FIRSTNAME="Test" -p LASTNAME="User ${USER_NUM}" -f "$PWD/user-template.yml" | oc apply -f -
done
