# Use Node.js for building the Vue.js app
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Vue.js app
RUN npm run build

# Use the official NGINX image to serve the app
FROM nginx:stable-alpine

# Copy the built app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8002
EXPOSE 8006

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
