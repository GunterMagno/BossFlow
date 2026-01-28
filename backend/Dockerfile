FROM node:20

WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install --production

# Copy source code (WITHOUT the root .env)
COPY . .

EXPOSE 5000

# Use npm start in production (not dev)
CMD ["npm", "start"]
