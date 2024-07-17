FROM node:22-bookworm-slim as builder

WORKDIR /app

COPY app/* .

RUN npm ci

ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV FFPROBE_PATH=/usr/bin/ffprobe
ENV FLUENTFFMPEG_COV=0

RUN npm run build

FROM node:22-bookworm-slim

WORKDIR /app

COPY --from=builder /app/.next .next
COPY app/*.json .
COPY app/*.mjs .
COPY buildFfmpegScript.bash .

RUN ./buildFfmpegScript.bash
