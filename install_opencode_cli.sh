#!/bin/bash

install_all_users() {
    echo "Installing OpenCode CLI for all users (requires sudo)..."
    npm run build
    sudo cp dist/opencode.js /usr/local/bin/opencode
}

uninstall_all_users() {
    echo "Uninstalling OpenCode CLI for all users (requires sudo)..."
    sudo rm /usr/local/bin/opencode
}

quit() {
    echo "Quitting..."
    exit 0
}

# Display menu
echo "OpenCode CLI Installer/Uninstaller"
echo "1) Install OpenCode CLI for all users (requires sudo)"
echo "2) Uninstall OpenCode CLI for all users (requires sudo)"
echo "3) Quit"

# Read user input
read -p "Select an option [1-3]: " choice

# Execute selection
case $choice in
    1) install_all_users ;;
    2) uninstall_all_users ;;
    3) quit ;;
    *) echo "Exiting." ;;
esac
