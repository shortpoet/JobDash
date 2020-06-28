# Mounts the server/seeds files into /opt/seed in the container
docker-compose run --rm mongo sh -c /opt/seed/import-seeds.sh
