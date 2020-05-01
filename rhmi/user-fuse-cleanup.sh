DEV_USERNAME="${DEV_USERNAME:-evals}"


# Remove all syndesis custom resource
for i in $(oc get syndesis --all-namespaces | grep $DEV_USERNAME | awk '{print $2}'); do
    oc delete syndesis $i -n $i-fuse
done

# Remove subscriptions
for i in $(oc get subscriptions --all-namespaces | grep $DEV_USERNAME | awk '{print $2}'); do
    NAMESPACE=$(echo $i | sed 's/syndesis/fuse/g')
    oc delete subscription $i -n $NAMESPACE
done

# Remove operator group
for i in $(oc get operatorgroups --all-namespaces  | grep -v NAMESPACE | grep $DEV_USERNAME | awk '{print $1}'); do
    oc delete operatorgroup $i-og -n $i
done

# Remove namespaces
oc delete namespace $(oc get projects -l user-fuse-online=true | grep -v NAME | awk '{print $1}' | xargs)
