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
- https://dev.to/_rema_lp/debugging-nestjs-typescript-in-a-docker-container-19a3
- https://github.com/kostis-codefresh/nestjs-example
- https://github.com/denpalrius/docker-nestjs-starter (has azure pipelines)
- https://blog.logrocket.com/containerized-development-nestjs-docker/
- https://hub.docker.com/r/nestjs/cli/
- https://medium.com/better-programming/part-7-deploy-backend-nestjs-docker-docker-compose-2429c0b6aa9c
- https://github.com/Saluki/nestjs-template/blob/master/Dockerfile
- https://www.codemag.com/Article/1909081/Nest.js-Step-by-Step-Part-2
- https://medium.com/@basakabhijoy/dockerise-a-nestjs-app-2b7f42fc333f
- https://dev.to/abbasogaji/how-to-dockerize-your-nestjs-app-for-production-2lmf
- https://codefresh.io/docker-tutorial/node_docker_multistage/
- https://medium.com/better-programming/9-tips-for-local-node-js-development-using-docker-compose-19789f44158
- https://github.com/BretFisher/node-docker-good-defaults/blob/master/docker-compose.yml
- https://nickjanetakis.com/blog/docker-tip-75-how-to-avoid-node-modules-in-your-volume-mounts
- https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes
- https://blog.sixeyed.com/docker-volumes-on-windows-the-case-of-the-g-drive/
- http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
- https://semaphoreci.com/community/tutorials/dockerizing-a-node-js-web-application
- https://stackoverflow.com/questions/30043872/docker-compose-node-modules-not-present-in-a-volume-after-npm-install-succeeds
- https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#upgradingdowngrading-yarn
- https://nodesource.com/blog/containerizing-node-js-applications-with-docker
- https://blog.scottlowe.org/2017/11/08/how-tag-docker-images-git-commit-information/
- http://beyondthecorneroffice.com/2018-04-18-MongoDB-on-Windows-Docker/
- https://willi.am/blog/2016/08/11/docker-for-windows-dealing-with-windows-line-endings/
- https://stackoverflow.com/questions/2825428/why-should-i-use-core-autocrlf-true-in-git
- https://help.github.com/en/github/using-git/configuring-git-to-handle-line-endings

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