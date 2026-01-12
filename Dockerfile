FROM node:20-alpine AS development

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Usar el puerto de la variable de entorno PORT (env)
# react-scripts usa la variable PORT por defecto
ENV PORT=3001

# Exponer el puerto configurado
EXPOSE ${PORT}

# Iniciar la aplicación en modo desarrollo
CMD ["npm", "start"]
