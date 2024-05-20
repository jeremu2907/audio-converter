#!/bin/bash

cd ~/taudio
docker compose pull
docker compose up --force-recreate -d
