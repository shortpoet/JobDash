docker-compose build --force-rm --no-cache
echo "Installing symlinks for node_modules"
ln -sv /tmp/dashboard-install/node_modules dashboard
ln -sv /tmp/server-install/node_modules server
