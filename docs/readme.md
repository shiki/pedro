# Pedro

## Prototypes

https://trello.com/c/sm6c1tf4

## Tools used (or to be used)

* Queueing https://github.com/Automattic/kue
* Clustering for NodeJS https://nodejs.org/api/cluster.html
* SinonJS for stubbing http://sinonjs.org/
* [Offensive](https://github.com/muroc/offensive.js)

## Native iOS

* Found an iOS native library for creating modals like Overcast and Apple Music: [DeckTransition](https://github.com/HarshilShah/DeckTransition?ref=ioscookies.com)
* http://componentkit.org
* https://facebook.github.io/yoga/

### Editors

* [prettier-vscode](https://github.com/prettier/prettier-vscode) for VS Code. Instructions [here](https://hackernoon.com/configure-eslint-prettier-and-flow-in-vs-code-for-react-development-c9d95db07213) to set it all up

## Setting up the database

1. Install postgres `$ brew install postgresql`. Homebrew would create a db named `postgres` but only a user using the current macOS username.
2. Create a superuser named `postgres`: `$ createuser -s postgres`
3. Log in as `postgres`: `$ psql -U postgres`
4. Create the database using the SQL in `001-create-pedro-db.sql`. Create another one for the test DB
5. Run the migrations. Inside the `web` folder: `$ ./node_modules/.bin/db-migrate up`. Run the migration for the test DB by adding a `--env=test` parameter.

## Commands

To run the server for development

```bash
$ npm start
```

To run the tests:

```
$ npm test
```

To build for production

```
$ npm clean
$ npm build
```

To run the production build

```
$ npm serve
```
