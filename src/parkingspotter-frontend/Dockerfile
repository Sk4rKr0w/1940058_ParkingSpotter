# Dockerfile per frontend
FROM node:20

WORKDIR /app

# Copia package.json e package-lock.json / yarn.lock
COPY package*.json ./

# Installa tutte le dipendenze
RUN npm install

# Copia tutto il progetto
COPY . .

# Espone la porta del frontend
EXPOSE 5173

# Comando di avvio
CMD ["npm", "run", "dev", "--", "--host"]
