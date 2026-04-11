FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for Vite)
RUN npm ci

# Copy app source
COPY . .

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0"]
