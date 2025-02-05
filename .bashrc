#
# Flowstate Bash Config
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return
alias ls='ls --color=auto'
alias grep='grep --color=auto'
set -o vi
# for xclip
export DISPLAY=:0
export EDITOR='nvim'
export TERMINAL=/usr/bin/ghostty
export LIBGL_ALWAYS_INDIRECT=1

# Utils ---------------------------------
source ~/.bash_utils
source /usr/share/fzf/key-bindings.bash
source /usr/share/fzf/completion.bash

#----------------------------------------
# Bash Aliases
alias ls='ls --color=auto'
alias cl='clear'
alias tsrc='nvim ~/.config/tmux/tmux.conf'
alias mb=access_database
alias conf='cd ~/.config/nvim/'
alias env=environment_activator
alias grep='grep --color=auto'
alias vi='nvim'
alias iconf='nvim $HOME/.config/i3/config'
alias gconf='nvim ~/.config/ghostty/config'
alias pconf='nvim ~/.config/picom/picom.conf'
alias rconf='nvim ~/.config/rofi/config.rasi'
alias raconf='nvim ~/.config/ranger/ranger.conf'
alias nconf='nvim ~/.config/neofetch/config.conf'
alias vconf='nvim ~/.config/nvim/lua'
alias ll='ls -la'
alias l="ls -Gha"
alias vb='nvim ~/.bashrc'
alias nv='nvim'
alias rd=readmefile
alias pac='sudo pacman -Syuy'
alias aur='yay -S $@'
alias load='curl -LO $@'
alias install='sudo pacman -S $@'
alias search='sudo pacman -Ss --verbose'
alias py='python3 -q'
alias lv=level_deep
alias update='git pull'
alias lgit='exa --long --header --inode --git'
alias ls='exa --icons'
alias gbc=git_checkout_braches
alias vm=multipile_files
alias ds='rm -vr ~/.local/state/nvim/swap//%home%archmk%"$1".swp'
alias gt='ghostty +list-themes'
alias val=valgrind_checker
alias fl=create_open_executable_file
alias sh='nvim ~/.ssh/config'
alias bug=fun
alias tssh=ssh_file_transfer
alias clean='rm -rf $PWD/__pycache__'
alias src='source ~/.bashrc'
alias remove=rmv
alias tui='textual run --dev $@'
#----------------------------GIT_COMMANDS-------------------------------------------#
alias status="git status"
alias ch="git switch $1"
alias push="git push origin"
alias pull="git pull origin"
alias commit="git commit -m"
alias add="git add ."
alias gitname="git config --global user.name 'gh057'"
alias gitmail="git config --global user.email 'victormurithi2020@gmail.com'"
alias ginit="git init"
alias remote="git remote add origin"
#----------------------------GIT_COMMANDS-------------------------------------------#

# Functions
# this will happen when you have a maraidb server running
access_database() {
  if [ -n "$1" ]; then
    mariadb -ugitty -p --ssl=OFF -D "$1"
  fi
}

readmefile() {
  echo -e "$1" >>README.md
}

fun() {
  nvim +$1 $2
}

function level_deep {
  exa --long --tree --level="${1:-1}"
}

git_checkout_braches() {
  git checkout "$1"
}

multipile_files() {
  nvim -O "$@"
}

rmv() {
  sudo pacman -R "$@"
}

valgrind_checker() {
  # still more better ways to implement this
  # only checkout for the definetly lost memory, and possibly lost memory
  valgrind --leak-check=full --track-origins=yes --show-leak-kinds=all -v "$@"
}

# Prompt Style ----------------------------------------------
export PROMPTS=(
  " "
  "λ "
  "󰘧 "
  "∑ "
  " "
)
export RANDOM=$(date +%s)
export ignition=${PROMPTS[$((RANDOM % ${#PROMPTS[@]}))]}

# Profile ---------------------------------------------------
export PS1="\[\e[0;32m\]${YELLOW}\W\[\e[m\]\[\e[32m\]\`parse_git_branch\`\[\e[m\]\n${blue}${ignition}${reset}${white}"

function parse_git_branch() {
  BRANCH=$(git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
  if [ ! "${BRANCH}" == "" ]; then
    STAT=$(parse_git_dirty)
    echo "  ${BRANCH}${STAT}"
  else
    echo ""
  fi
}

function parse_git_dirty {
  STATUS="$(git status --porcelain 2>/dev/null)"
  if [[ $? -ne 0 ]]; then
    printf ""
    return
  fi

  # Count files for each status
  RENAMED_COUNT=$(echo "$STATUS" | grep -c "^R")
  AHEAD_COUNT=$(git rev-list --count HEAD@{upstream}..HEAD 2>/dev/null || echo 0)
  NEW_FILE_COUNT=$(echo "$STATUS" | grep -c "^A")
  UNTRACKED_COUNT=$(echo "$STATUS" | grep -c "^??")
  MODIFIED_COUNT=$(echo "$STATUS" | grep -c "^ M")
  DELETED_COUNT=$(echo "$STATUS" | grep -c "^ D")

  # Print status with counts
  printf " {"
  if [[ $RENAMED_COUNT -gt 0 ]]; then printf " ":$RENAMED_COUNT; fi                              # File renamed
  if [[ $AHEAD_COUNT -gt 0 ]]; then printf " :$AHEAD_COUNT"; fi                                  # Branch is ahead
  if [[ $NEW_FILE_COUNT -gt 0 ]]; then printf " ${tan}$NEW_FILE_COUNT New${reset}"; fi            # New file added
  if [[ $UNTRACKED_COUNT -gt 0 ]]; then printf " ${purple}$UNTRACKED_COUNT Untracked${reset}"; fi # Untracked files
  if [[ $MODIFIED_COUNT -gt 0 ]]; then printf " ${blue}$MODIFIED_COUNT Modified${reset}"; fi      # File modified
  if [[ $DELETED_COUNT -gt 0 ]]; then printf " ${red}💀 $DELETED_COUNT Deleted${reset}"; fi        # File deleted
  printf " }"
  # Clean Working Tree
  if [[ $RENAMED_COUNT -eq 0 && $AHEAD_COUNT -eq 0 && $NEW_FILE_COUNT -eq 0 && $UNTRACKED_COUNT -eq 0 && $MODIFIED_COUNT -eq 0 && $DELETED_COUNT -eq 0 ]]; then
    printf " 🧹"
  fi
}

function nonzero_return() {
  RETVAL=$?
  [ $RETVAL -ne 0 ] && echo "$RETVAL"
}
#--------------------------------------------------------------------------------

function environment_activator {
  source "$1"/bin/activate
}

function create_open_executable_file {
  touch "$1"
  if test -f "$1"; then
    chmod +x "$1"
    nvim "$1"
  fi
}

# fzf -----------------------------------------------------------------------------------------
selection=$(
  find -type d 2>/dev/null | fzf --multi --reverse --height=80% \
    --preview='exa --long --tree --level=3 --color=always --no-permissions --no-filesize --no-time --no-user  {}' --preview-window='45%,border-sharp' \
    --prompt='  ' \
    --bind='del:execute(rm -ri {+})' \
    --bind='ctrl-p:toggle-preview' \
    --bind='ctrl-d:change-prompt(Dirs > )' \
    --bind='ctrl-d:+reload(find -type d)' \
    --bind='ctrl-d:+change-preview(exa --long --tree --level=3 --color=always --no-permissions --no-filesize --no-time --no-user {})' \
    --bind='ctrl-d:+refresh-preview' \
    --bind='ctrl-f:change-prompt(Files > )' \
    --bind='ctrl-f:+reload(find -type f)' \
    --bind='ctrl-f:+change-preview(bat --color=always {})' \
    --bind='ctrl-f:+refresh-preview' \
    --bind='ctrl-a:select-all' \
    --bind='ctrl-x:deselect-all' \
    --header '


  ███████▓    ▒█████  █     █░ █████▒███████▒
▓██   ▓██▒   ▒██▒  ██▓█░ █ ░█▓██   ▒▒ ▒ ▒ ▄▀░
▒████ ▒██░   ▒██░  ██▒█░ █ ░█▒████ ░░ ▒ ▄▀▒░ 
░▓█▒  ▒██░   ▒██   ██░█░ █ ░█░▓█▒  ░  ▄▀▒   ░
░▒█░  ░██████░ ████▓▒░░██▒██▓░▒█░   ▒███████▒
 ▒ ░  ░ ▒░▓  ░ ▒░▒░▒░░ ▓░▒ ▒  ▒ ░   ░▒▒ ▓░▒░▒
 ░    ░ ░ ▒  ░ ░ ▒ ▒░  ▒ ░ ░  ░     ░░▒ ▒ ░ ▒
 ░ ░    ░ ░  ░ ░ ░ ▒   ░   ░  ░ ░   ░ ░ ░ ░ ░
          ░  ░   ░ ░     ░            ░ ░    
 CTRL-d to display directories
 CTRL-f to display files
 CTRL-a to select all
 CTRL-x to deselect all
 CTRL-p to toggle preview
 ENTER to edit | DEL to delete
 '
)

OPTS=(
  "FZF_CTRL_T_OPTS"
  "FZF_CTRL_R_OPTS"
  "FZF_ALT_C_OPTS"
)

for opt in "${OPTS[@]}"; do
  export "$opt"="--height 60% \
  --layout reverse \
  --prompt '∷ ' \
  --pointer ▶ \
  --marker ⇒"
done

# Determine what to do depending on the selection
if [ -d "$selection" ]; then
  cd "$selection" || exit
else
  if [ -z $selection ]; then
    echo "No file selected!"
  else
    eval "$EDITOR $selection"
  fi
fi

# uv
export PKG_CONFIG_PATH=/usr/lib/pkgconfig:$PKG_CONFIG_PATH
# export PATH="/home/archmkk/getCracked/cmd-pamodoro/asciigen/zig-out/bin/asciigen"
export TERM=xterm-256color
