FROM node:alpine
WORKDIR /app
COPY ./package.json /app
COPY ./index.js /app/
COPY ./routes/* /app/routes/
COPY ./services/* /app/services/
COPY ./process.env /app/
RUN npm install
CMD ["npm", "run", "start"]
