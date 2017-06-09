# Database

## Design

We use MySQL Workbench for the ERD. It's just simply the best one out there. All the other Postgres specific ones aren't that good. The ERD file is `erd.mwb`

## UUIDs

Some research was done whether to use `id` or `uuid` as primary keys. It is no question that 
`id` will always perform better. I think I just don’t need an `id` pk for now because the rows would be small. But in the future, I can expand them to add `id` int PKs. I should just make sure to name the current pk as `uuid`

## Migrations

Migrations are done with [db-migrate](https://github.com/db-migrate/node-db-migrate).

To migrate both test and dev databases

```
$ ./node_modules/.bin/db-migrate --env test up
$ ./node_modules/.bin/db-migrate --env dev up
```

## Tools

Some tools for working with Postgres:

* [PSequel](http://www.psequel.com/)
* [pgweb](https://github.com/sosedoff/pgweb)

## Login Credentials

1. If there is no logged in user, generate a random GUID and use that as the identifier
2. If the user registers, merge all current anonymous data
3. If the user logs in (old user), remove everything and replace with the user's data
  * The Bring! app just removes everything and replaces all data with the logged-in data
4. If the user logs out, remove all data and log in as anonymous

* CloudKit API may not return a valid iCloud account because the user can disable iCloud
* I guess using iCloud user ID involves too much work with little benefit. I think it would be better if we just generate a GUID and use that as the identifier. 
* We will use _Login with Facebook_ and _Login with Google_. We will need to provide a way to define the email address to use.

## Resources

* [How to store UUIDs in Postgres](http://www.simononsoftware.com/how-to-store-uuids-in-postgresql/)
* [CHAR(X) VS. VARCHAR(X) VS. VARCHAR VS. TEXT – UPDATED 2010-03-03](https://www.depesz.com/2010/03/02/charx-vs-varcharx-vs-varchar-vs-text/)
* [Always Use TIMESTAMP WITH TIME ZONE](http://justatheory.com/computers/databases/postgresql/use-timestamptz.html)
* [UUIDs & Clustered Indexes](http://www.postgresql-archive.org/UUIDs-amp-Clustered-Indexes-td5918560.html) Information about Postgres not really having a clustered index mechanism so the issues regarding guid causing performance issues is irrelevant. There's also [this](https://goo.gl/1I9DBL).
* [Which UUID version to use](https://stackoverflow.com/questions/20342058/which-uuid-version-to-use)
* [UUID Primary Keys in PostgreSQL](http://www.starkandwayne.com/blog/uuid-primary-keys-in-postgresql/)

## Facts

* iOS `NSUUID` uses UUID v4

## Postgres Notes

### Logging in 

```
$ psql
```

To exit, enter `\q`

### Creating a database

```sql
CREATE DATABASE my_postgres_db OWNER postgres_user;
```