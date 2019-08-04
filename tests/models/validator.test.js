const { beforeAction, afterAction } = require('../init/setup');
const { randomInt, randomString } = require('../../src/helpers/random');
const Validator = require('../../src/models/validator');

let validator;

// eslint-disable-next-line one-var
let validatorAddress,
  publicKeyType,
  publicKeyValue,
  validatorIndex,
  votingPower;

beforeAll(async () => {
  await beforeAction();
});

afterAll(() => {
  afterAction();
});

beforeEach(async () => {
  validatorAddress = randomString(40);
  publicKeyType = `test/${randomString()}`;
  publicKeyValue = randomString(45);
  validatorIndex = randomInt();
  votingPower = randomInt();

  validator = await Validator.create({
    validatorAddress,
    publicKeyType,
    publicKeyValue,
    validatorIndex,
    votingPower,
  });
});

test('Validator is created correctly', async () => {
  const returnedValidator = validator.toJSON();
  expect(returnedValidator.validatorAddress).toBe(validatorAddress);
  expect(returnedValidator.id).toBeFalsy();
  await validator.destroy();
});

test('Validator is updated correctly', async () => {
  const testPublicKeyType = 'tendermint/PubKeyEd25519';
  const testPublicKeyValue = 'H/T2zkDfFx7ZKgDCXP+WvxscARiptSNEBxPQkXRXIIM=';

  await validator.update({
    publicKeyType: testPublicKeyType,
    publicKeyValue: testPublicKeyValue,
  });

  expect(validator.publicKeyType).toBe(testPublicKeyType);
  expect(validator.publicKeyValue).toBe(testPublicKeyValue);

  const returnedValidator = validator.toJSON();
  expect(returnedValidator.publicKey).toBeTruthy();

  const returnedPublicKey = returnedValidator.publicKey;
  expect(returnedPublicKey.type).toBe(testPublicKeyType);
  expect(returnedPublicKey.value).toBe(testPublicKeyValue);

  await validator.destroy();
});
