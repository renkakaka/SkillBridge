#!/bin/bash

# Set Prisma environment variables for Netlify
export PRISMA_GENERATE_DATAPROXY="false"
export PRISMA_CLIENT_ENGINE_TYPE="binary"
export PRISMA_CLI_BINARY_TARGETS="native,linux-musl,debian-openssl-3.0.x,rhel-openssl-1.0.x"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

# Build Next.js
echo "Building Next.js..."
npm run build
