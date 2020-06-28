#!/bin/bash
mongoimport --host mongo --db job-db --drop --collection contacts --type json --file /opt/seed/contacts.seed.json --jsonArray
mongoimport --host mongo --db job-db --drop --collection tasks --type json --file /opt/seed/tasks.seed.json --jsonArray
mongoimport --host mongo --db job-db --drop --collection messages --type json --file /opt/seed/messages.seed.json --jsonArray
