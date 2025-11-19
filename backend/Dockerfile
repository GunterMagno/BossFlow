FROM node:20

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install --production

# Copiar código fuente (SIN el .env de la raíz)
COPY . .

EXPOSE 5000

# Usar npm start en producción (no dev)
CMD ["npm", "start"]
