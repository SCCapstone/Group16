# Node 22
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the entire Angular project
COPY . .

# Build the Angular app
RUN ng build

# Expose the port the app runs on
EXPOSE 4000

# Run the server
CMD ["npm", "run", "serve:ssr:fe-app"]
