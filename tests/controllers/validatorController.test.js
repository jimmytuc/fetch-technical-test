/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const request = require('supertest');
const { beforeAction, afterAction } = require('../init/setup');
const { randomInt, randomString } = require('../../src/helpers/random');
const Validator = require('../../src/models/validator');

const SIZE = 10;
const ENDPOINT = '/api/v1';

let app;
const validators = [];

beforeAll(async () => {
  app = await beforeAction();
});

afterAll(() => {
  afterAction();
});

beforeEach(async () => {
  for (let i = 0; i < SIZE; i++) {
    validators.push(await Validator.create({
      validatorAddress: randomString(40),
      public_key_type: `test_${i}${randomString()}`,
      public_key_value: randomString(45),
      validator_index: randomInt(),
      voting_power: randomInt(),
    }));
  }
});

afterEach(async (done) => {
  for (let i = 0; i < validators.length; i++) {
    await validators[i].destroy();
  }
  done();
});


test('Validator | create', async () => {
  const res = await request(app)
    .post(`${ENDPOINT}/validators`)
    .set('Accept', /json/)
    .send({
      validator_address: randomString(40),
      public_key_type: `test_${randomString()}`,
      public_key_value: randomString(45),
      validator_index: randomInt(5),
      voting_power: randomInt(),
    })
    .expect(200);

  expect(res.body.validator).toBeTruthy();

  const validator = await Validator.findOne({
    where: { validatorAddress: res.body.validator.validatorAddress },
  });

  const jsonValidator = validator.toJSON();

  expect(jsonValidator.publicKey.key).toBe(res.body.publicKey.key);
  expect(jsonValidator.publicKey.value).toBe(res.body.publicKey.value);

  await validator.destroy();
});

test('Validator | Validation | create', async () => {
  const res = await request(app)
    .post(`${ENDPOINT}/validators`)
    .set('Accept', /json/)
    .send({
      public_key_type: `test_${randomString()}`,
      public_key_value: randomString(45),
      validator_index: randomInt(5),
      voting_power: randomInt(),
    })
    .expect(400);

  expect(res.body.errors).toBeTruthy();
});

test('Validator | getAll', async () => {
  const res = await request(app)
    .get(`${ENDPOINT}/validators`)
    .set('Accept', /json/)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res.body.validators).toBeTruthy();
  expect(res.body.validators.length).toBe(SIZE);
});

test('Validator | Pagination | getAll', async () => {
  const res = await request(app)
    .get(`${ENDPOINT}/validators?page=2&limit=5`)
    .set('Accept', /json/)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res.body.validators).toBeTruthy();
  expect(res.body.validators.length).toBe(5);

  const _validators = await Validator.findAll({
    paginate: {
      offset: 5,
      limit: 5,
    },
  });

  expect(res.body.validators[5].validatorAddress).toBe(_validators[5].validatorAddress);
});

test('Validator | getOne', async () => {
  const validator = validators[1];
  const jsonValidator = validator.toJSON();

  const res = await request(app)
    .get(`${ENDPOINT}/validators/${jsonValidator.validatorAddress}`)
    .set('Accept', /json/)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res.body.validator).toBeTruthy();
  expect(res.body.validator.publicKey.value).toBe(jsonValidator.publicKey.value);
});

test('Validator | Not found | getOne', async () => {
  const res = await request(app)
    .get(`${ENDPOINT}/validators/${randomString()}`)
    .set('Accept', /json/)
    .set('Content-Type', 'application/json')
    .expect(404);

  expect(res.body.validator).toBeFalsy();
  expect(res.body.errors).toBeTruthy();
});
