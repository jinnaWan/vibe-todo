# GitHub Actions Self-Hosted Runner - Docker Management

# Variables
DOCKER_REGISTRY ?= 043309363453.dkr.ecr.ap-southeast-2.amazonaws.com/vibe-todo/github-runner
IMAGE_NAME ?= github-runner
TAG ?= latest
PLATFORM ?= linux/arm64

# Docker build (run from project root)
.PHONY: build
build:
	@echo "Building Docker image for $(PLATFORM)..."
	docker build \
		--platform $(PLATFORM) \
		-f .github/docker/Dockerfile \
		-t $(IMAGE_NAME):$(TAG) \
		.github/docker/

# Tag for registry
.PHONY: tag
tag:
	@echo "Tagging image for registry..."
	docker tag $(IMAGE_NAME):$(TAG) $(DOCKER_REGISTRY):$(TAG)

# Push to registry
.PHONY: push
push: tag
	@echo "Pushing image to registry..."
	docker push $(DOCKER_REGISTRY):$(TAG)

# Build and push
.PHONY: deploy
deploy: build push
	@echo "Build and push completed successfully!"

# Run locally for testing
.PHONY: run-local
run-local:
	@echo "Running container locally for testing..."
	@echo "Note: Set REPO_URL and PAT_TOKEN environment variables"
	docker run -it --rm \
		-e REPO_URL=$(REPO_URL) \
		-e PAT_TOKEN=$(PAT_TOKEN) \
		-e LABELS="local,test" \
		$(IMAGE_NAME):$(TAG)

# Clean up
.PHONY: clean
clean:
	@echo "Cleaning up Docker images..."
	docker rmi $(IMAGE_NAME):$(TAG) || true
	docker rmi $(DOCKER_REGISTRY):$(TAG) || true
	docker system prune -f

# Help
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  build      - Build the Docker image"
	@echo "  tag        - Tag image for registry"
	@echo "  push       - Push image to registry"
	@echo "  deploy     - Build and push image"
	@echo "  run-local  - Run container locally for testing"
	@echo "  clean      - Clean up Docker images"
	@echo ""
	@echo "Variables:"
	@echo "  DOCKER_REGISTRY - Docker registry URL"
	@echo "  IMAGE_NAME      - Image name (default: github-runner)"
	@echo "  TAG             - Image tag (default: latest)"
	@echo "  PLATFORM        - Target platform (default: linux/arm64)"
	@echo ""
	@echo "Example usage:"
	@echo "  make -f .github/docker/Makefile build"
	@echo "  make -f .github/docker/Makefile deploy"
	@echo ""
	@echo "Note: Run this from the project root directory" 