# Use Ubuntu Jammy (22.04) as base image
FROM ubuntu:jammy

# Maintained by Cam Osterholt
LABEL maintainer="Cam Osterholt"

# Copy the JAR file to the container / Can make a ARG to access with ${}
ADD ./target/be-0.2.jar be-0.2.jar

# Set non-interactive mode to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install dependencies
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    maven \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Install Spring Boot CLI
RUN curl -s https://get.sdkman.io | bash \
    && bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install springboot"

# Verify installations
RUN java -version && mvn -version && bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && spring --version"

# Set entrypoint to bash for interactive use
#ENTRYPOINT ["/bin/bash"]

# Set entrypoint to run the JAR file
ENTRYPOINT ["java", "-jar", "be-0.2.jar"]

# TO RUN: 