#!/bin/bash

# Displays a confirmation prompt.

# Parameters:
# $1: Confirmation text
# $2: Code to run on acceptance
# $3: Code to run on rejection

confirmation_prompt() {
    read -r -p "$(echo -e $1) [y/N] " response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
    then
        eval $2
    else
        eval $3
    fi
}