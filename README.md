# fetch technical test
## Run dev
- `npm start`: run in dev environment
- `npm run nodemon`: run as background process in dev environment

## Eslint checking
- `npm pretest`

## Run tests
- `npm test`
- `npm test-ci`

Results:
![alt text](https://prnt.sc/opbqfc "Test cases passed")

## Docker environment
- `make up`: compose all services
- `make test`: run test inside docker container
- `make down`: dispose all services

## Issue?
By default, `sequelize-cli` is installed locally, feel free to run `npm run migrate` if this error occurs: `relations 'validators' cannot be found`.
Even if you couldn't run the application, try to install sequelize-cli for helping the migration process more easier. For example: `npm install -g sequelize-cli`

Figure:
![alt text](https://prnt.sc/opbptw "Migration running")
