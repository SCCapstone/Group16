cd /home/cam/capstone/Group16
minikube start
docker login ghcr.io -u osterholt -p $GITHUB_AUTH
kubectl apply -f .k8s/classmate-api.yaml
kubectl apply -f .k8s/classmate-fe.yaml
kubectl get pods