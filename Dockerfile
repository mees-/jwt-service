FROM node:lts
LABEL maintainer="Mees van Dijk <mees@mees.io>"
WORKDIR /app
ADD ./src ./src/
ADD ./package*.json ./
ADD ./tsconfig.json .
RUN npm install

ENV PORT=80
RUN npm run setup
CMD ["npm", "start"]
