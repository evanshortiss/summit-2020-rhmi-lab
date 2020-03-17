QUAY_USER=${QUAY_USER:-evanshortiss}
TAG=${TAG:-latest}

docker tag summit-2020-rhmi-lab-nodejs-backend quay.io/$QUAY_USER/summit-2020-rhmi-lab-nodejs-backend:$TAG
docker push quay.io/$QUAY_USER/summit-2020-rhmi-lab-nodejs-backend:$TAG
