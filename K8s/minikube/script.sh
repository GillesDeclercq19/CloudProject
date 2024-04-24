#!/bin/bash
kubectl apply -f ConfigMap.yaml
kubectl apply -f mongo-deployment.yaml
kubectl apply -f mongo-service.yaml
kubectl apply -f minikube-back.yaml
kubectl apply -f minikube-back-service.yaml
kubectl apply -f minikube-front.yaml
kubectl apply -f minikube-front-service.yaml
