# JobDash

```
nest new <name>
nest generate module <name>
nest generate controller <name>
nest generate service <name>
```

## dashboard

```bash
yarn dev
```

## server

```bash
yarn start
```

## docker

```bash
docker-compose up
```

- https://stackoverflow.com/questions/54911021/unable-to-start-docker-mongo-image-on-windows

```bash
docker volume create --name=mongodata
docker run -d -p 27017:27017 -v mongodata:/data/db --name=mymongo mongodb:3.3
```

```yml
services:
  mongodb_container:
    ...
    volumes:
      - mongodata:/data/db
volumes:
  mongodata:
```