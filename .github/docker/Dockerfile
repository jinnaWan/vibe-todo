# Use Ubuntu 22.04 for ARM64
FROM ubuntu:22.04

# Set arguments for runner version
ARG RUNNER_VERSION="2.325.0"
ARG RUNNER_ARCH="arm64"

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV RUNNER_MANUALLY_TRAP_SIG=1
ENV ACTIONS_RUNNER_PRINT_LOG_TO_STDOUT=1

# Install essential packages only
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    git \
    jq \
    ca-certificates \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create runner user with proper permissions
RUN adduser --disabled-password --gecos "" --uid 1001 runner \
    && usermod -aG sudo runner \
    && echo "%sudo ALL=(ALL:ALL) NOPASSWD:ALL" > /etc/sudoers \
    && echo "Defaults env_keep += \"DEBIAN_FRONTEND\"" >> /etc/sudoers

# Install .NET SDK 8.0
RUN wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && rm packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y dotnet-sdk-8.0 \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install --global yarn \
    && rm -rf /var/lib/apt/lists/*

# Switch to runner user and set working directory
USER runner
WORKDIR /home/runner

# Download and install GitHub Actions runner
RUN curl -f -L -o runner.tar.gz \
    https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz \
    && tar xzf ./runner.tar.gz \
    && rm runner.tar.gz

# Create cache directories
RUN mkdir -p /home/runner/.npm \
    && mkdir -p /home/runner/.nuget \
    && mkdir -p /home/runner/_work

# Environment variables for runtime configuration
ENV REPO_URL="" \
    PAT_TOKEN="" \
    LABELS="" \
    RUNNER_NAME="" \
    DISABLE_RUNNER_UPDATE=true

# Copy the start script
COPY --chmod=755 start.sh /home/runner/start.sh

# Use start.sh as the entrypoint
ENTRYPOINT ["/home/runner/start.sh"] 