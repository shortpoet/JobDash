// https://stackoverflow.com/questions/42912755/how-to-create-a-db-for-mongodb-container-on-start-up
// https://docs.mongodb.com/manual/reference/method/
// https://hub.docker.com/_/mongo/
// https://medium.com/@bouffard.jul/use-case-add-an-init-script-to-the-docker-official-mongo-image-be58cb2dff25

printjson("################")
printjson("mongo init")
printjson("################")
db.createUser(
  {
    user: "root",
    pwd:  "root",
    roles: [ { role: "root", db: "root" }, { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
    // roles: [ { role: "root", db: "root" } ]
  }
);
db.createUser(
  {
    user: "jobdb-test",
    pwd:  "jobdb-test",
    roles: [ { role: "readWrite", db: "test" },
             { role: "readWrite", db: "job-db" } ]
  }
);
