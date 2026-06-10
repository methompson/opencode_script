echo "Adding the opencode command to the OS..."
echo "Run this command after you have run 'su <admin user>' and 'sudo su' from a standard account"

printf "%s " "Press enter to continue or Ctrl+C to cancel..."
read ans

cp dist/opencode.js /usr/local/bin/opencode