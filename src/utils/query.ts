import * as qs from 'qs';

export function parseQry(query: string) {
  return qs.parse(query, { ignoreQueryPrefix: true, depth: 4 });
}

export function stringifyQry(object: qs.ParsedQs) {
  return qs.stringify(object, {
    addQueryPrefix: true, arrayFormat: 'brackets', encode: false, skipNulls: true
  });
}
