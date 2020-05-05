# JWT service

This is a simple microservice that can create users, issue jwt tokens and
validate them

## Getting started

#### Connection string

make sure to set `CONNECTION_STRING` to some connection string to store in
database, the service uses [keyv](https://github.com/lukechilds/keyv) to store
data

#### setup database

fill in some details in src/setup.js first and then run it to store configs in
the database

#### run

after that you can run the service with `npm start` or `npm run dev` if you want
to also source `.env` file
