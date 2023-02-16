import { fetchWrap } from '@/utils';

fetchMock.mockResponse((req) => (
  req.url === 'TEST/bar'
    ? Promise.resolve({ status: 404, statusText: 'test status text' })
    : Promise.resolve({ status: 200, body: JSON.stringify({ data: [] }) })
));

describe('fetchWrap', () => {
  it('makes fetch request with params', async () => {
    await fetchWrap('foo', { method: 'POST' });
    expect(fetchMock).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith('TEST/foo', { method: 'POST' });
    await fetchWrap('');
    expect(fetchMock).toBeCalledWith('TEST');
    await fetchWrap(undefined);
    expect(fetchMock).toBeCalledWith('TEST');
    await fetchWrap('?q=123');
    expect(fetchMock).toBeCalledWith('TEST?q=123');
  });

  it('returns json if response OK', async () => {
    expect(await fetchWrap('foo')).toStrictEqual({ data: [] });
  });

  it('throws error if response not OK', async () => {
    const Error404 = new Error('404, test status text');
    await expect(fetchWrap('bar')).rejects.toThrow(Error404);
  });
});
