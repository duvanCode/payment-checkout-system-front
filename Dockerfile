# ========================================
# STAGE 1: Build de la aplicación React
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm install

# Copiar el resto del código
COPY . .

# Argumentos de build para variables de entorno
ARG REACT_APP_API_URL
ARG REACT_APP_API_KEY
ARG REACT_APP_SERVICE_URL
ARG REACT_APP_SERVICE_PUBLIC_KEY

# Establecer variables de entorno para el build
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_API_KEY=${REACT_APP_API_KEY}
ENV REACT_APP_SERVICE_URL=${REACT_APP_SERVICE_URL}
ENV REACT_APP_SERVICE_PUBLIC_KEY=${REACT_APP_SERVICE_PUBLIC_KEY}

# Construir la aplicación para producción
RUN npm run build

# ========================================
# STAGE 2: Servir con serve (optimizado para SPAs)
# ========================================
FROM node:20-alpine

WORKDIR /app

# Instalar 'serve' globalmente - herramienta optimizada para servir SPAs
RUN npm install -g serve

# Copiar los archivos del build desde el stage anterior
COPY --from=builder /app/build ./build

# Exponer puerto 80
EXPOSE 80

# Servir la aplicación con serve
# --single: redirige todas las rutas a index.html (para React Router)
# --listen: puerto a escuchar
CMD ["serve", "-s", "build", "-l", "80"]
