FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Install Python and Java
RUN apk add --no-cache python3 openjdk17

# Copy app source
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
