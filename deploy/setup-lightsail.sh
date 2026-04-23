#!/bin/bash
set -e

echo "=== Lightsail Initial Setup ==="

# Update system
sudo apt-get update -y && sudo apt-get upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 process manager
npm install -g pm2

# Install git if not present
sudo apt-get install -y git

# Create app directory
sudo mkdir -p /var/www/app
sudo chown -R $USER:$USER /var/www/app

# Setup PM2 to start on reboot
pm2 startup systemd -u $USER --hp $HOME
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

echo "=== Setup complete. Now run deploy/first-deploy.sh ==="
