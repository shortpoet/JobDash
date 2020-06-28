docker-compose down --rmi local --remove-orphans --volumes
docker image rm shortpoet/jobdash-client
docker image rm shortpoet/jobdash-mongo-seed 
docker image rm shortpoet/jobdash-server
