#!/usr/bin/env bash

# this will help you out when setting up gt.sh
if ((EUID == 0)); then
  echo "You are running this script as root!"
  echo "Just use sudo instead"
  exit 1
fi

# Check and create .config directory if it doesn't exist
if [[ ! -d "$HOME/.config" ]]; then
  echo "Creating .config directory for you"
  mkdir -p "$HOME/.config"
fi

# Move to .config directory
cd "$HOME/.config" || {
  echo "Failed to change directory to $HOME/.config"
  exit 1
}

# Download gt.sh from GitHub
curl -O https://raw.githubusercontent.com/fl0wstate/dotfiles/main/gt.sh

# Check if .bashrc exists and append alias to it
if [[ -f "$HOME/.bashrc" ]]; then
  echo "Adding some configuration to your bashrc..."
  # Append alias to bashrc if it doesn't already exist
  if ! grep -q "alias gt=" "$HOME/.bashrc"; then
    echo "alias gt='bash \"$HOME/.config/gt.sh\"'" >>"$HOME/.bashrc"
  else
    echo "Alias already exists in bashrc"
  fi
  # Source the updated .bashrc
  source "$HOME/.bashrc"
else
  echo ".bashrc not found!"
