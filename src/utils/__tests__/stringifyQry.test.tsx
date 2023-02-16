import { stringifyQry } from '@/utils';

describe('Stringify object into query string with prepended question mark', () => {
  test('Empty object', () => {
    expect(stringifyQry({})).toBe('');
  });

  test('Undefined', () => {
    expect(stringifyQry(undefined)).toBe('');
  });

  test('Null', () => {
    expect(stringifyQry(null)).toBe('');
  });

  test('Object with string value', () => {
    expect(stringifyQry({ foo: 'bar' })).toBe('?foo=bar');
  });

  test('Object with array of strings', () => {
    expect(stringifyQry({ foo: ['bar', 'baz'] })).toBe('?foo[]=bar&foo[]=baz');
  });

  test('Two dimensional object', () => {
    expect(stringifyQry({ foo: { bar: 'baz' } })).toBe('?foo[bar]=baz');
  });

  test('Object with array of objects', () => {
    expect(stringifyQry({ foo: [{ bar: 'baz' }, { qux: 'xyz' }] })).toBe('?foo[][bar]=baz&foo[][qux]=xyz');
  });
});
