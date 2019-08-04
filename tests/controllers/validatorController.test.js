/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const request = require('supertest');
const { beforeAction, afterAction } = require('../init/setup');
const { randomInt, randomString } = require('../../src/helpers/random');
const Validator = require('../../src/models/validator');

const ENDPOINT = '/api/v1';
const SIZE = 100;
const validators = [];
let app;
let address;

beforeAll(async () => {
  app = await beforeAction();
});

afterAll(() => {
  afterAction();
});

beforeEach(async () => {
  for (let i = 0; i < SIZE; i++) {
    address = randomString(20);
    const validator = await Validator.create({
      validatorAddress: address,
      publicKeyType: `test_${i}/${randomString()}`,
      publicKeyValue: randomString(25),
      validatorIndex: randomInt(),
      votingPower: randomInt(),
    });
    validators.push(validator.validatorAddress);
  }
});

afterEach(async (done) => {
  for (let i = 0; i < validators.length; i++) {
    await Validator.destroy({
      where: {
        validatorAddress: validators[i],
      },
    });
  }
  done();
});

test('ValidatorAPI request create', async () => {
  const res = await request(app)
    .post(`${ENDPOINT}/validators`)
    .send({
      validator_address: randomString(20),
      public_key_type: `test/${randomString()}`,
      public_key_value: randomString(25),
      validator_index: randomInt(),
      voting_power: randomInt(),
    })
    .expect(200);

  expect(res.body.validator).toBeTruthy();

  const validator = await Validator.findOne({
    where: { validatorAddress: res.body.validator.validatorAddress },
  });

  const jsonValidator = validator.toJSON();

  expect(jsonValidator.publicKey.type).toBe(res.body.validator.publicKey.type);
  expect(jsonValidator.publicKey.value).toBe(res.body.validator.publicKey.value);

  await validator.destroy();
});

test('ValidatorAPI validating request create', async () => {
  const res = await request(app)
    .post(`${ENDPOINT}/validators`)
    .send({
      public_key_type: `test/${randomString()}`,
      public_key_value: randomString(25),
      validator_index: randomInt(),
      voting_power: randomInt(),
    })
    .expect(400);

  expect(res.body.errors).toBeTruthy();
});

test('ValidatorAPI request getAll with default limit = 10', async () => {
  const res = await request(app)
    .get(`${ENDPOINT}/validators`)
    .set('Accept', /json/)
    .expect(200);

  expect(res.body.validators).toBeTruthy();
  expect(res.body.validators.length).toBe(10);
});

test('ValidatorAPI request getAll with specify pagination', async () => {
  const res = await request(app)
    .get(`${ENDPOINT}/validators?page=2&limit=5`)
    .set('Accept', /json/)
    .expect(200);

  expect(res.body.validators).toBeTruthy();
  expect(res.body.validators.length).toBe(5);

  const _validators = await Validator.findAndCountAll({
    offset: 5,
    limit: 5,
    where: { active: true },
  });

  expect(res.body.validators[4].validatorAddress).toBe(_validators.rows[4].validatorAddress);
});

test('ValidatorAPI request getAll with pagination has limit > 100', async () => {
  const res = await request(app)
    .get(`${ENDPOINT}/validators?page=1&limit=100`)
    .set('Accept', /json/)
    .expect(200);

  expect(res.body.validators).toBeTruthy();
  expect(res.body.validators.length).toBe(50);
});

test('ValidatorAPI request getAll with pagination has limit < 1', async () => {
  const res = await request(app)
    .get(`${ENDPOINT}/validators?page=1&limit=-1`)
    .set('Accept', /json/)
    .expect(200);

  expect(res.body.validators).toBeTruthy();
  expect(res.body.validators.length).toBe(1);
});

test('ValidatorAPI request getOne', async () => {
  const res = await request(app)
    .get(`${ENDPOINT}/validators/${address}`)
    .set('Accept', /json/)
    .expect(200);

  expect(res.body.validator).toBeTruthy();
  expect(res.body.validator.validatorAddress).toBe(address);
});

test('ValidatorAPI request getOne not found', async () => {
  const randomAddress = randomString();
  const res = await request(app)
    .get(`${ENDPOINT}/validators/${randomAddress}`)
    .set('Accept', /json/)
    .expect(404);

  expect(res.body.validator).toBeFalsy();
  expect(res.body.errors).toBeTruthy();
});
