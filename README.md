# fetch technical test
## Run dev
- `npm start`: run in dev environment
- `npm run nodemon`: run as background process in dev environment

## Eslint checking
- `npm pretest`

## Run tests
- `npm test`
- `npm test-ci`

## Docker environment
- `make up`: compose all services
- `make test`: run test inside docker container
- `make down`: dispose all services

## Issue?
- By default, `sequelize-cli` is installed locally, feel free to run `npm run migrate` if this error occurs: `relations 'validators' cannot be found`.
- If it's still cannot? Change the `src/controllers/validatorController.js` to `src/controllers/ValidatorController.js`
