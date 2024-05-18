FROM node:20-bookworm-slim

WORKDIR /app

COPY app/package.json .
COPY app/package-lock.json .

RUN npm install
