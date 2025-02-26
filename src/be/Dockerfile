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

# Set the working directory
WORKDIR /app

# Accept environment variables from build args
ARG MONGO_URI
ARG MONGO_DATABASE
ARG MAIL_SMTP_HOST
ARG MAIL_SMTP_PORT
ARG MAIL_SMTP_USERNAME
ARG MAIL_SMTP_PASSWORD

# Set environment variables in the container
ENV MONGO_URI=${MONGO_URI}
ENV MONGO_DATABASE=${MONGO_DATABASE}
ENV MAIL_SMTP_HOST=${MAIL_SMTP_HOST}
ENV MAIL_SMTP_PORT=${MAIL_SMTP_PORT}
ENV MAIL_SMTP_USERNAME=${MAIL_SMTP_USERNAME}
ENV MAIL_SMTP_PASSWORD=${MAIL_SMTP_PASSWORD}

# Copy the JAR file to the container
ARG JAR_FILE=target/be-0.2.jar
COPY ${JAR_FILE} app.jar

# Expose the port the app runs on
EXPOSE 1616

# Set entrypoint to run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]

# TO BUILD: docker build --build-arg JAR_FILE=target/be-0.2.jar -t classmate-api .
# TO RUN: docker run -p 1616:1616 --env-file .env classmate-api