FROM node:24

WORKDIR /app/ssh-client

# node-pty
COPY ./node-pty ./node-pty
# logger
COPY ./logger ./logger
# other app dependencies
COPY ./package.json ./package-lock.json ./tsconfig.json ./
RUN npm install

COPY ./*.ts .
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/server.js"]
