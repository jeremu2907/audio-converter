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
    apt install -y wget xz-utils gcc pkg-config make && \
    apt clean

RUN cd / && \
    wget https://ffmpeg.org/releases/ffmpeg-7.0.1.tar.xz && \
    tar xf ffmpeg-7.0.1.tar.xz && \
    rm -rf ffmpeg-7.0.1.tar.xz && \
    cd /ffmpeg-7.0.1 && \
    ./configure && \
    ./configure \
        --disable-ffplay \
        --disable-doc \
        --disable-swresample \
        --disable-swscale \
        --disable-postproc \
        --disable-w32threads \
        --disable-network \
        --disable-dwt \
        --disable-error-resilience \
        --disable-lsp \
        --disable-faan \
        --disable-pixelutils \
        --disable-everything && \
    make && \
    make install
