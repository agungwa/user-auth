# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_PORT
ARG JWT_SECRET
ARG PORT

ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV DB_PORT=$DB_PORT
ENV JWT_SECRET=$JWT_SECRET
ENV PORT=$PORT
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /express-docker

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN yarn install

# Starting our application
CMD [ "node", "server.js" ]

# Exposing server port
EXPOSE 3000