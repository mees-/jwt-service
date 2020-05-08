# JWT service

This is a simple microservice that can create users, issue jwt tokens and
validate them

## Getting started

#### Connection string

make sure to set `CONNECTION_STRING` to some connection string if you want to
store users in a database, the service uses
[keyv](https://github.com/lukechilds/keyv) to store data. If you want to store
data in a database you will also need to install an
[adapter for keyv](https://github.com/lukechilds/keyv#official-storage-adapters)
.

# Configuration

Take a look at the `src/config.ts` file for configuration. Run `npm run setup`
to create an admin user with which you can create new users.


#### run

after that you can run the service with `npm start` or `npm run dev` if you want
to also source `.env` file
