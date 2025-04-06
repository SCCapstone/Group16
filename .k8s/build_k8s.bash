cd /home/cam/capstone/Group16
minikube start --driver=docker --static-ip=192.168.49.2
# minikube config set kubelet.node-ip 192.168.49.2
docker login ghcr.io -u osterholt -p $GITHUB_AUTH
kubectl apply -f .k8s/classmate-api.yaml
kubectl apply -f .k8s/classmate-fe.yaml
kubectl apply -f .k8s/classmate-api-rbac.yaml
kubectl apply -f .k8s/classmate-api-rolebinding.yaml
kubectl get pods