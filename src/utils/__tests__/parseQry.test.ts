import { parseQry } from '@/utils';

describe('Parsing valid query string', () => {
  test('Query string with one key with question mark', () => {
    expect(parseQry('?foo=bar')).toEqual({ foo: 'bar' });
  });

  test('Query string with one key without question mark', () => {
    expect(parseQry('foo=bar')).toEqual({ foo: 'bar' });
  });

  test('Query string with multiple keys', () => {
    expect(parseQry('foo=bar&baz=qux')).toEqual({ foo: 'bar', baz: 'qux' });
  });

  test('Query string with array of values', () => {
    expect(parseQry('foo[]=bar&foo[]=baz')).toEqual({ foo: ['bar', 'baz'] });
  });

  test('Two dimensional query string', () => {
    expect(parseQry('foo[bar]=baz')).toEqual({ foo: { bar: 'baz' } });
  });

  test('Three dimensional query string', () => {
    expect(parseQry('foo[bar][baz]=qux')).toEqual({ foo: { bar: { baz: 'qux' } } });
  });

  test('Two dimensional query string with array of values', () => {
    expect(parseQry('foo[bar][]=baz&foo[bar][]=qux')).toEqual({ foo: { bar: ['baz', 'qux'] } });
  });
});

describe('Parsing invalid string', () => {
  test('Empty string', () => {
    expect(parseQry('')).toEqual({});
  });

  test('String without equal', () => {
    expect(parseQry('foobar')).toEqual({ foobar: '' });
  });

  test('String with multiple equals', () => {
    expect(parseQry('fo=o==ba=r')).toEqual({ fo: 'o==ba=r' });
  });

  test('Keys with empty values', () => {
    expect(parseQry('foo&bar&buz')).toEqual({ foo: '', bar: '', buz: '' });
  });

  test('Extra & out of place', () => {
    expect(parseQry('&foo&&bar&&')).toEqual({ foo: '', bar: '' });
  });

  test('Only special symbols', () => {
    expect(parseQry('&=&&=&&')).toEqual({});
  });
});
