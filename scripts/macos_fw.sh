#!/bin/bash

# Function to enable network access
enable_network_access() {
  # Step 1: Determine your Mac's IP address
  mac_ip=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}')

  # Step 2: Configure your development server to listen on your Mac's IP address
  # Replace `your_server_address` with the appropriate address configuration in your development server code/configuration file

  # Step 3: Configure the macOS firewall
  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setallowsigned on
  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add "$server_application"
  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp "$server_application"

  # Step 4: Ensure your local network device is connected to the same network

  # Step 5: Access the development server from the local network device
  echo "You can now access your development server hosted on your Mac at: http://${mac_ip}:<your_server_port>"
}

# Function to disable network access
disable_network_access() {
  # Step 3: Configure the macOS firewall to block the server application
  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --remove "$server_application"
}

# Function to revert all changes made
revert_changes() {
  # Step 3: Reset macOS firewall to default settings
  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setallowsigned off
}

# Check the command-line arguments
if [ "$#" -eq 0 ]; then
  echo "Please provide the action ('enable', 'disable', or 'revert') as the first argument."
  exit 1
fi

action=$1
server_application=$2

case $action in
  enable)
    enable_network_access
    ;;
  disable)
    disable_network_access
    ;;
  revert)
    revert_changes
    ;;
  *)
    echo "Invalid action. Please use 'enable', 'disable', or 'revert'."
    exit 1
    ;;
esac

exit 0
