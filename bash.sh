# upload all the config files in the system to this directory
#!/usr/bin/env bash
configs=(
  "rofi"
  "ghostty"
  "i3"
  "picom"
  "nvim"
  "tmux"
)

for config_folder in "${configs[@]}"; do
  cp -r "$HOME/.config/$config_folder" .
done
cp ~/.bashrc .
echo "Done copying all the configs files here"
# for the bashrc
