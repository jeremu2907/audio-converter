FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY app/* .

RUN npm ci

ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV FFPROBE_PATH=/usr/bin/ffprobe
ENV FLUENTFFMPEG_COV=0

RUN npm run build

FROM node:22-bookworm-slim

WORKDIR /app
ENV HOME=/app

COPY --from=builder /app/.next .next
COPY app/*.json .
COPY app/*.mjs .

RUN apt update && \
    apt install -y ffmpeg && \
    apt clean && \
    npm install next
