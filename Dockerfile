FROM node:current-alpine
WORKDIR /srv/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE ${PORT}
CMD ["npm", "run", "start"]