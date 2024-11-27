#!/bin/bash

# Network interface name
INTERFACE="eth0"

# IPv6 prefix
PREFIX="2a01:4ff:f0:4325"

# Generate a random suffix (last 64 bits)
RANDOM_SUFFIX=$(printf "%x:%x:%x:%x" $((RANDOM)) $((RANDOM)) $((RANDOM)) $((RANDOM)))

# Combine prefix and suffix
IPV6_ADDRESS="${PREFIX}:${RANDOM_SUFFIX}"

# Add the new address to the interface
sudo ip -6 addr add "${IPV6_ADDRESS}/64" dev "${INTERFACE}"

# Display the new address
echo "Assigned IPv6 address: ${IPV6_ADDRESS}"