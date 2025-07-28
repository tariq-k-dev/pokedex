import { cleanInput } from './repl.js';
import { Cache } from './pokecache.js';
import { describe, expect, test } from 'vitest';

describe.each([
  {
    input: '  hello  world  ',
    expected: ['hello', 'world'],
  },
  // TODO: more test cases here
  {
    input: '  foo   bar  baz  ',
    expected: ['foo', 'bar', 'baz'],
  },
])('cleanInput($input)', ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    // TODO: call cleanInput with the input here
    const actual = cleanInput(input);

    // The `expect` and `toHaveLength` functions are from vitest
    // they will fail the test if the condition is not met
    expect(actual).toHaveLength(expected.length);
    for (const i in expected) {
      // likewise, the `toBe` function will fail the test if the values are not equal
      expect(actual[i]).toBe(expected[i]);
    }
  });
});

test.concurrent.each([
  {
    key: 'https://example.com',
    val: 'testdata',
    interval: 500, // 1/2 second
  },
  {
    key: 'https://example.com/path',
    val: 'moretestdata',
    interval: 1000, // 1 second
  },
])('Test Caching $key for $interval ms', async ({ key, val, interval }) => {
  const cache = new Cache(interval);

  // Test adding and getting
  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toEqual(val);

  // Wait for the reap interval to pass
  await new Promise((resolve) => setTimeout(resolve, interval + 100));

  // Test that the entry has been reaped
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  // Cleanup the test-specific interval timer
  cache.stopReapLoop();
});
