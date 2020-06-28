# Mounts the server/seeds files into /opt/seed in the container
docker-compose run --rm --entrypoint bash -v "${PWD}"/server/seed:/opt/seed mongo /opt/seed/import-seeds.sh "$@"
