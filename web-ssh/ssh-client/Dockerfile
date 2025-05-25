FROM node:24

WORKDIR /app/ssh-client

# WORKDIR /app/ssh-client/node-pty
# node-pty
COPY ./node-pty ./node-pty

# WORKDIR /app/ssh-client/logger
# logger
COPY ./logger ./logger
# RUN npm install

# WORKDIR /app/ssh-client
# app dependencies
COPY ./package.json ./package-lock.json ./tsconfig.json ./
RUN npm install

COPY ./*.ts .
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/server.js"]
# CMD ["tail", "-f", "/dev/null"]
