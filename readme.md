# JWT service

This is a simple microservice that can create users, issue jwt tokens and
validate them

## Getting started in docker

### Environment variables

- `CONNECTION_STRING` some postgres connection string. Format:
  `postgres://user:password@host:port/database_name`
- `SECRET` the hmac sh256 signing secret
- `ISSUER` the issuer name on the tokens
- `AUDIENCE` _optional_: the audience on the tokens
- `EXPIRY_TIME` _optional_: the time after which a JWT expires. This is parsed
  with [Zeit/ms](https://github.com/zeit/ms).
- `PORT` _optional_: _in docker_ this is set to 80 by default
- `ADMIN_USER` _optional_: set this to set the user id for the admin user.
  Default: `admin`
- `ADMIN_PASS`: _optional_: set this to set the password for the admin user.
  If you don't set this then no admin user is created.

Setting `ADMIN_PASS` essentially only needs to happen once on first run, since
the admin user doesn't need to be recreated every time. It is safe to keep it
set though. If a user with `ADMIN_USER` as username already exists, it won't be
modified and admin user creation will be skipped.
