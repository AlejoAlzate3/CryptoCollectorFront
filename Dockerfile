# Etapa 1: Construcción
FROM node:25-alpine3.22 AS build

# Instalar actualizaciones de seguridad
RUN apk update && apk upgrade --no-cache

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Construir la aplicación para Docker
RUN npm run build -- --configuration docker

# Etapa 2: Servidor Nginx
FROM nginx:1.29-alpine3.22

# Actualizar paquetes de seguridad
RUN apk update && apk upgrade --no-cache

# Copiar archivos de construcción al servidor Nginx
COPY --from=build /app/dist/cryto-collector-front/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Reset ENTRYPOINT y establecer CMD para nginx
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
