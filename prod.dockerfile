FROM node:20-bookworm-slim

WORKDIR /app

COPY app/* .

RUN npm ci

ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV FFPROBE_PATH=/usr/bin/ffprobe
ENV FLUENTFFMPEG_COV=0

RUN apt update && \
    apt upgrade && \
    apt install -y ffmpeg

RUN npm run build
