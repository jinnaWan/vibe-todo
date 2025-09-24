#!/bin/bash
kind create cluster --config kind-config.yaml
kubectl apply -k k8s/