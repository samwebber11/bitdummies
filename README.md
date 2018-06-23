# BitDummies

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
$ cd bitdummies
$ npm install
  or
  yarn add
$ cd client
$ npm install
  or
  yarn add
$ cd ../
$ npm start:dev
  or
  yarn start:dev
```

### Miscellaneous information

- Backend server runs on port 3001 (localhost)
- React server (for development) runs on port 3000 (localhost)
- All keys/configurations are to be stored in a "non-committed" file `keys.js` which has the path: `/backend/config/keys.js`.
