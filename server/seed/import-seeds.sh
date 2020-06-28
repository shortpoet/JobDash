#!/bin/bash
set -o errexit -o pipefail
SCRIPT="$(cd "${0%/*}" && echo "$PWD"/${0##*/})"
BASEDIR="`dirname "$SCRIPT"`"
cd $BASEDIR

mongoimport --host mongo --db job-db --drop --collection contacts --type json --file contacts.seed.json --jsonArray
mongoimport --host mongo --db job-db --drop --collection tasks --type json --file tasks.seed.json --jsonArray
mongoimport --host mongo --db job-db --drop --collection messages --type json --file messages.seed.json --jsonArray
