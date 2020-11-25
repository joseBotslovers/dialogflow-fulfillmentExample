# imagen que vamos a usar
FROM node:12
# directorio donde vamos a instalarlo centro de la imagen
WORKDIR /usr/src/app
# corremos todos los archivos que empiecen por package y que acaben en .json
COPY package*.json ./
#dependencias node
RUN npm install
#Copiamos todos los arachivos
COPY . .
#puerto
EXPOSE 3000
# que vamos a ejecutar
CMD ["npm","index.js"]