# Use an official Node runtime as the base image
FROM node:18.14.2

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the application
RUN npm install

# Bundle app source
COPY . .

# Expose the application on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]