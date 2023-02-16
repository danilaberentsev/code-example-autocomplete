import { act, renderHook } from '@testing-library/react';
import { useDebouncedRequest } from '@/hooks';

const data = [{ foo: 'bar' }];

fetchMock.mockResponse((req) => (
  req.url === 'TEST/error'
    ? Promise.resolve({ status: 404, statusText: 'test status text' })
    : Promise.resolve(JSON.stringify({ data }))
));

beforeAll(() => {
  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
  jest.spyOn(global, 'clearTimeout');
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('useDebouncedRequest hook', () => {
  test('standard input output and flow', async () => {
    const { result } = renderHook(() => useDebouncedRequest({ urn: 'foo', delay: 1000, dataKey: 'data' }));

    await act(() => {
      const promise = result.current.debounced();
      expect(fetchMock).not.toBeCalled();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(result.current.timerRef.current).not.toBeNull();

      act(() => jest.advanceTimersByTime(1000));
      expect(fetchMock).toBeCalledTimes(1);
      expect(fetchMock).toBeCalledWith('TEST/foo', {
        method: 'GET',
        signal: result.current.controllerRef.current.signal
      });

      promise.then((res) => {
        expect(result.current.loading).toBe(true);
        expect(res).toStrictEqual(data);
        expect(result.current.controllerRef.current).not.toBeNull();
      });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toStrictEqual(data);
  });

  it('calls fetch with query params provided with GET method', async () => {
    const { result } = renderHook(useDebouncedRequest);

    await act(() => {
      result.current.debounced({ q: 'bar' });
      act(() => jest.advanceTimersByTime(500));
      expect(fetchMock).toBeCalledWith('TEST?q=bar', {
        method: 'GET',
        signal: result.current.controllerRef.current.signal
      });
    });
  });

  it('calls fetch with body params provided with non-GET method, e.g. POST', async () => {
    const { result } = renderHook(() => useDebouncedRequest({ method: 'POST' }));

    await act(() => {
      result.current.debounced({ q: 'bar' });
      act(() => jest.advanceTimersByTime(500));
      expect(fetchMock).toBeCalledWith('TEST', {
        body: JSON.stringify({ q: 'bar' }),
        method: 'POST',
        signal: result.current.controllerRef.current.signal
      });
    });
  });

  it('calls fetch only once on sequenced calls under delay range', async () => {
    const { result } = renderHook(() => useDebouncedRequest({ delay: 1000 }));

    await act(() => {
      result.current.debounced({ q: '1' });
      result.current.debounced({ q: '2' });
      result.current.debounced({ q: '3' });

      expect(setTimeout).toHaveBeenCalledTimes(3);
      expect(fetchMock).not.toBeCalled();

      act(() => jest.advanceTimersByTime(1000));
      expect(fetchMock).toBeCalledTimes(1);
      expect(fetchMock).toBeCalledWith('TEST?q=3', {
        method: 'GET',
        signal: result.current.controllerRef.current.signal
      });
    });
  });

  it('cancels request if sequentially called after timeout at request pending state', async () => {
    const { result } = renderHook(() => useDebouncedRequest({ delay: 1000 }));

    await act(() => {
      result.current.debounced();
      act(() => jest.advanceTimersByTime(1000));
      expect(result.current.controllerRef.current).toBeInstanceOf(AbortController);
      expect(result.current.controllerRef.current.signal.aborted).toBe(false);
      result.current.debounced();
      expect(result.current.controllerRef.current.signal.aborted).toBe(true);
      act(() => jest.advanceTimersByTime(1000));
      expect(result.current.controllerRef.current.signal.aborted).toBe(false);
    });
  });

  it('returns error after request error', async () => {
    const { result } = renderHook(() => useDebouncedRequest({ urn: 'error' }));

    await act(() => {
      result.current.debounced();
      act(() => jest.runAllTimers());
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toStrictEqual(new Error('404, test status text'));
  });

  test('abort after timeout', async () => {
    const { result } = renderHook(useDebouncedRequest);

    await act(() => {
      result.current.debounced();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      act(() => jest.runAllTimers());
      result.current.abort();
      expect(clearTimeout).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toBeCalled();
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.controllerRef.current.signal.aborted).toBe(true);
    expect(result.current.timerRef.current).toBe(null);
  });

  test('abort during timeout', async () => {
    const { result } = renderHook(useDebouncedRequest);

    await act(() => {
      result.current.debounced();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      result.current.abort();
      expect(clearTimeout).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).not.toBeCalled();
    expect(result.current.loading).toBe(null);
    expect(result.current.controllerRef.current).toBe(null);
    expect(result.current.timerRef.current).toBe(null);
  });
});
