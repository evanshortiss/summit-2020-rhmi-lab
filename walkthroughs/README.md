## Solution Pattern (Walkthrough) Content

The Ansible installer should automatically do this, but if you'd like to
manually install this Solution Pattern on an RHMI cluster do the following:

1. Login as `kubeadmin` using `oc login -u kubeadmin`
1. Run `oc patch webapp tutorial-web-app-operator -n webapp --type=merge -p '{"spec":{"template":{"parameters":{"WALKTHROUGH_LOCATIONS":"https://github.com/evanshortiss/summit-2020-rhmi-lab"}}}}'`
