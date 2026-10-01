#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script with sudo: sudo bash deploy/setup-ubuntu.sh [deploy-user]" >&2
  exit 1
fi

DEPLOY_USER="${1:-fwdeploy}"
APP_ROOT="/var/www/fwwebsite"

if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
  echo "Docker Engine and the Docker Compose plugin must be installed first." >&2
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "Docker Engine is not running or the current account cannot access it." >&2
  exit 1
fi
if ! command -v curl >/dev/null; then
  apt-get update
  apt-get install --yes curl
fi

if ! getent passwd "$DEPLOY_USER" >/dev/null; then
  useradd --create-home --shell /bin/bash "$DEPLOY_USER"
fi
DEPLOY_GROUP="$(id -gn "$DEPLOY_USER")"
DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
getent group docker >/dev/null || groupadd docker
usermod --append --groups docker "$DEPLOY_USER"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_GROUP" -m 0700 "$DEPLOY_HOME/.ssh"
touch "$DEPLOY_HOME/.ssh/authorized_keys"
chown "$DEPLOY_USER:$DEPLOY_GROUP" "$DEPLOY_HOME/.ssh/authorized_keys"
chmod 0600 "$DEPLOY_HOME/.ssh/authorized_keys"
install -d -o "$DEPLOY_USER" -g www-data -m 2750 "$APP_ROOT" "$APP_ROOT/releases"

echo "Deployment account: $DEPLOY_USER"
echo "App directory: $APP_ROOT"
echo "Docker: $(docker --version)"
docker compose version
echo "The deploy account has Docker access (equivalent to root-level host control)."
echo "Next: add the GitHub Actions public key to /home/$DEPLOY_USER/.ssh/authorized_keys."
