# Use Ubuntu Jammy (22.04) as base image
FROM ubuntu:jammy

# Maintained by Cam Osterholt
LABEL maintainer="Cam Osterholt"

# Set non-interactive mode to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install dependencies
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /app

# Copy the JAR file to the container
ARG JAR_FILE=target/be-0.2.jar
COPY ${JAR_FILE} app.jar

# Expose the port the app runs on
EXPOSE 1616

# Set entrypoint to bash for interactive use
# ENTRYPOINT ["/bin/bash"]

# Set entrypoint to run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]

# TO BUILD: docker build -t classmate-api .
# TO BUILD with unique jar: docker build --build-arg JAR_FILE=target/be-0.2.jar -t classmate-api .
# TO RUN: docker run -p 1616:1616 classmate-api