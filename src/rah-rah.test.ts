const RahRahLib = require('./rah-rah');
const RahRah = RahRahLib.RahRah;
const R = RahRahLib.R;

test('map works', () => {
  const starting = RahRah.success('hello');
  const ending = starting.map((z: string) => z.toUpperCase());
  expect(ending.yay).toBe('HELLO');
});

test('mapBoo works', () => {
  const starting = RahRah.failure('hello');
  const ending = starting.mapBoo((z: string) => z.toUpperCase());
  expect(ending.boo).toBe('HELLO');
});

test('R success', async () => {
  const starting = await R(Promise.resolve('hello'));
  expect(starting.yay).toBe('hello');
});

test('R failure', async () => {
  const starting = await R(Promise.reject('goodbye'));
  expect(starting.boo).toBe('goodbye');
});

test('incorrect access of yay', async () => {
  const starting = await R(Promise.reject('uh oh'));
  expect(() => starting.yay).toThrow('Not a successful result');
});

test('incorrect access of boo', async () => {
  const starting = await R(Promise.resolve('success!'));
  expect(() => starting.boo).toThrow('Not a failed result');
});

test('withDefault for success', async () => {
  const starting = await R(Promise.resolve('success!'));
  expect(starting.withDefault('a default')).toBe('success!');
});

test('withDefault for failure', async () => {
  const starting = await R(Promise.reject('failure!'));
  expect(starting.withDefault('a default')).toBe('a default');
});

test('applyDefault for success', async () => {
  const starting = await R(Promise.resolve('success!'));
  expect(starting.applyDefault((err: string) => `an error: ${err}`)).toBe('success!');
});

test('applyDefault for failure', async () => {
  const starting = await R(Promise.reject('failure!'));
  expect(starting.applyDefault((err: string) => `an error: ${err}`)).toBe('an error: failure!');
});
