export const ABORT_ERROR_NAME = 'AbortError';

type RestFetchParams = Parameters<typeof fetch> extends [unknown, ...infer R] ? R : never;

export function fetchWrap(urn: string, ...rest: RestFetchParams) {
  let uri = `${process.env.API_BASE_URL}`;
  if (urn) uri += urn.startsWith('?') ? urn : `/${urn}`;

  return fetch(uri, ...rest).then((resp) => {
    if (resp.ok) return resp.json();

    throw new Error(`${resp.status}, ${resp.statusText}`);
  });
}
