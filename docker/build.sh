docker-compose build --force-rm --no-cache
echo "Installing symlinks for node_modules"
ls -a
ls -a server
# ln -sv /tmp/dashboard-install/node_modules ./../dashboard/node_modules
ln -sv /tmp/server-install/node_modules server/node_modules
