PASSWORD=${PASSWORD:-summitpass2020}
NAMESPACE=${NAMESPACE:-redhat-rhmi-rhsso}
REGULAR_USERNAME=${REGULAR_USERNAME:-evals}
REALM=${REALM:-testing-idp}
NUM_REGULAR_USER=${NUM_REGULAR_USER:-50}

# make this the current working dir (easier template reference)
PWD=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# target the SSO namespace
oc project $NAMESPACE

format_user_name() {
  USER_NUM=$(printf "%02d" "$1") # Add leading zero to number
  USERNAME="$2$USER_NUM"         # Username combination of passed in username and number
}

for ((i = 1; i <= NUM_REGULAR_USER; i++)); do
  format_user_name $i "$REGULAR_USERNAME"
  oc patch keycloakuser/$REALM-$USERNAME --type='json' -p '[{"op": "replace", "path": "/spec/user/credentials/0/value", "value": "'$PASSWORD'"}]' -n $NAMESPACE
done
