FROM node:20-bookworm-slim

WORKDIR /app

COPY app/package.json .
COPY app/package-lock.json .

RUN npm install

ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV FFPROBE_PATH=/usr/bin/ffprobe
ENV FLUENTFFMPEG_COV=0

RUN apt update && \
    apt upgrade && \
    apt install -y ffmpeg
