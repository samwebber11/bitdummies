# BitDummies [![Build Status](https://travis-ci.org/BitDummies/bitdummies.svg?branch=master)](https://travis-ci.org/BitDummies/bitdummies)

Create your own 3D mini-me.

## Project structure

- Project is organized into `backend` and `client`.
- The client directory contains the packages and dependencies for itself.
- The top level directory contains all the packages and dependencies for backend, and also the packages and dependencies required by both backend and client.
> Rule of thumb: If a package is required just by the client, install it in the `client` directory, else install it in the top level directory.
- Package manager used is: `Yarn`.

## Setup instructions

```zsh
$ git clone https://github.com/BitDummies/bitdummies.git
...
$ cd bitdummies
$ yarn install
...
$ cd client
$ yarn install
...
$ cd ../
$ yarn start:dev
...
```

### Miscellaneous information

- Backend server runs on port 3001 (localhost)
- React server (for development) runs on port 3000 (localhost)
- All keys/configurations are to be stored in a "non-committed" file `keys.js` which has the path: `/backend/config/keys.js`.
- All tests are contained in a folder called `test`.
- Any utility functions required have been written in `utils.js`.

### Instructions for running tests

- In the project root folder, run:

```zsh
$ yarn test
yarn run v1.7.0
...
```

**Warning:** Some tests might fail the first couple times as Jest tries to figure out the best way to run the tests. It does this because tests perform asynchronous operations on the database. Troubleshooting steps are given below:

- Open a MongoDB Daemon by running `mongod` in a terminal.
- Open another terminal window and run:

```zsh
$ mongo --host localhost:27017
> show dbs
...
...

> use test-database
switched to db test-database

> show collections
addresses
orders
products
users
```

- Now run the following commands:

```zsh
> db.addresses.remove({})
...

> db.orders.remove({})
...

> db.products.remove({})
...

> db.users.remove({})
...
```

**Note:** The last 4 commands must be run each time any test fails.
