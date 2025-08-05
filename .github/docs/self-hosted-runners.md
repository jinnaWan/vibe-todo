# Self-Hosted GitHub Actions Runners on AWS ECS

This repository is configured to use self-hosted GitHub Actions runners running on AWS ECS for better performance, cost control, and customization.

## Overview

The self-hosted runner setup consists of:

1. **Docker Image**: Custom ARM64 Ubuntu image with .NET SDK, Node.js, Docker, and other tools
2. **ECS Configuration**: Task definitions and cluster setup for running containers
3. **Reusable Workflows**: Clean, maintainable workflow for runner management
4. **Configuration Files**: Environment-specific settings for different workloads

## Architecture

```
GitHub Actions Workflow
    ↓
Reusable Runner Management Workflow
    ↓
AWS ECS Task (Self-Hosted Runner)
    ↓
Your Test/Build Jobs
```

## Quick Start

### Prerequisites

1. **AWS Account** with ECS permissions
2. **GitHub Repository** with appropriate secrets configured
3. **Docker Registry** (ECR) to store the runner image

### Required Secrets

Configure these in your GitHub repository settings:

```
AWS_ACCOUNT_ID          # Your AWS account ID
GITHUB_TOKEN           # GitHub token with repo and actions permissions
PAT_TOKEN             # Personal Access Token for runner registration
```

### Configuration Files

Edit the configuration files in `.github/configs/` to match your AWS environment:

#### `.github/configs/backend.env`
```bash
ECS_CLUSTER=your-cluster-name
TASK_DEFINITION=your-task-definition
CAPACITY_PROVIDER=EC2
CONTAINER_NAME=github-runner
CONTAINER_MEMORY=4096
CONTAINER_CPU=2048
```

#### `.github/configs/frontend.env`
```bash
ECS_CLUSTER=your-cluster-name
TASK_DEFINITION=your-task-definition
CAPACITY_PROVIDER=EC2
CONTAINER_NAME=github-runner
CONTAINER_MEMORY=3072
CONTAINER_CPU=1536
```

## Usage

### Automatic Usage

By default, workflows will use self-hosted runners automatically. To disable:

```yaml
# Manually trigger with GitHub-hosted runners
workflow_dispatch:
  inputs:
    use_self_hosted:
      description: 'Use self-hosted runners'
      type: boolean
      default: false
```

### Manual Runner Management

You can also use the runner management workflow directly:

```yaml
jobs:
  start-runner:
    uses: ./.github/workflows/manage-runner.yml
    with:
      action: start
      config: backend  # or frontend
      labels: custom,labels
    secrets:
      AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      PAT_TOKEN: ${{ secrets.PAT_TOKEN }}

  your-job:
    runs-on: ${{ needs.start-runner.outputs.runner_label }}
    needs: start-runner
    steps:
      # Your steps here

  stop-runner:
    if: always()
    needs: [start-runner, your-job]
    uses: ./.github/workflows/manage-runner.yml
    with:
      action: stop
      config: backend
      task_arn: ${{ needs.start-runner.outputs.task_arn }}
    secrets:
      AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      PAT_TOKEN: ${{ secrets.PAT_TOKEN }}
```

## AWS Setup

### 1. Build and Push Docker Image

```bash
# Build the image
docker build -f .github/docker/Dockerfile -t github-runner:latest .

# Tag for ECR
docker tag github-runner:latest YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/github-runner:latest

# Push to ECR
docker push YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/github-runner:latest
```

### 2. Create ECS Task Definition

Use the example from your provided ECS task definition, but update:

- **Image URI**: Point to your ECR repository
- **Environment Variables**: Configure `REPO_URL`, `LABELS`, etc.
- **Secrets**: Add `PAT_TOKEN` from AWS Secrets Manager
- **Task Role**: Ensure proper permissions for GitHub API access

### 3. Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name github-runners-cluster
```

### 4. IAM Roles

**Task Execution Role** needs:
- `AmazonECSTaskExecutionRolePolicy`
- Access to Secrets Manager for `PAT_TOKEN`

**Task Role** needs:
- ECR access (if building/pushing images)
- Any other AWS services your jobs need

**GitHub Actions Role** needs:
- `ecs:RunTask`
- `ecs:StopTask`
- `ecs:DescribeTasks`
- Pass role permissions

## Monitoring and Troubleshooting

### CloudWatch Logs

Monitor runner logs in CloudWatch:
- Log Group: As configured in your task definition
- Look for runner registration and job execution logs

### GitHub Actions

- Check the Actions tab for workflow runs
- Monitor runner status in Settings → Actions → Runners

### Common Issues

1. **Runner not appearing**: Check CloudWatch logs for registration errors
2. **Task fails to start**: Verify task definition, security groups, and subnets
3. **Jobs hang**: Ensure runner labels match between workflow and configuration

## Cost Optimization

- **Spot Instances**: Use spot capacity providers for cost savings
- **Right-sizing**: Adjust CPU/memory based on actual usage
- **Auto-scaling**: Configure cluster auto-scaling based on demand
- **Scheduled Scaling**: Scale down during off-hours

## Security Considerations

- **Network Isolation**: Use private subnets with NAT gateway
- **Secrets Management**: Store sensitive data in AWS Secrets Manager
- **IAM Least Privilege**: Grant minimal required permissions
- **Image Scanning**: Regularly scan Docker images for vulnerabilities

## Customization

### Adding Tools

Modify `.github/docker/Dockerfile` to add additional tools:

```dockerfile
# Add your custom tools
RUN apt-get update && apt-get install -y your-tool
```

### Environment-Specific Configs

Create new config files in `.github/configs/` for different environments:

```bash
# Production config
.github/configs/production.env

# Staging config  
.github/configs/staging.env
```

## Benefits

✅ **Cost Control**: Pay only for compute time used  
✅ **Performance**: Faster job execution with dedicated resources  
✅ **Customization**: Install exactly what you need  
✅ **Security**: Run in your own AWS environment  
✅ **Scalability**: Auto-scale based on demand  

## Support

For issues:
1. Check CloudWatch logs
2. Review GitHub Actions workflow runs
3. Verify AWS resource configuration
4. Check this documentation for troubleshooting tips 