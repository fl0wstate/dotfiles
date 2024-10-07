#!/usr/bin/env bash
#
filename=$1
commit_message=$2
repo_name=$(git rev-parse --abbrev-ref HEAD)

# Function to display error messages
display_error() {
    echo -e "\033[1;31mError:\033[0m $1"
}

# Function to display success messages
display_success() {
    echo -e "\033[1;32mSuccess:\033[0m $1"
}

if [[ -z "$filename" && -z "$commit_message" || -z "$repo_name" ]];
then
        display_error "Usage: gt [<filename>] [<commit_message>]"
elif [[ -z "$filename" ]];
then
        echo "Error: No Filename"
elif [[ -z "$commit_message" ]];
then
        echo "Error: No Commit message"
elif [[ -z "$repo_name" ]];
then
        echo "Error: No repo??"
else
        display_success "Pushing changes to [$repo_name]..."
        sleep 1
        git add "$filename" && git commit -m "$commit_message" && git push origin "$repo_name"
        display_success "Changes pushed successfully sir!"
fi
