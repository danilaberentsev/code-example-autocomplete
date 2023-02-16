import { act, renderHook, waitFor } from '@testing-library/react';
import { useRemoteAutocomplete } from '@/Autocomplete';

const suggestions = [{ id: 'foo', name: 'bar' }];

fetchMock.mockResponse((req) => (
  req.url === 'TEST/error?q='
    ? Promise.resolve({ status: 404, statusText: 'test status text' })
    : Promise.resolve(JSON.stringify(suggestions))
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

describe('useRemoteAutocomplete hook', () => {
  it('loads suggestions and collect into state on shouldLoad=true', async () => {
    const { result } = renderHook(useRemoteAutocomplete);
    act(() => result.current.actions.focus()); // updates shouldLoad = true
    act(() => jest.runAllTimers()); // invokes request after timer runs out

    await act(async () => {
      await waitFor(() => expect(result.current.loading).toBe(true));
    }); // waits for request to be finished

    expect(result.current.loading).toBe(false);
    expect(result.current.suggestions).toEqual(suggestions);
  });

  it('aborts ongoing requests if next value has cached suggestions', async () => {
    const { result } = renderHook(() => useRemoteAutocomplete({ initialState: { cache: { foo: suggestions } } }));
    act(() => result.current.actions.focus()); // updates shouldLoad = true
    act(() => result.current.actions.change({ value: 'foo' })); // value with cached suggestions - shouldLoad = false
    expect(clearTimeout).toBeCalled(); // still abort previous request even though next debounced wasn't called
    expect(result.current.suggestions).toEqual(suggestions);
  });

  it('aborts ongoing requests on unmount ', async () => {
    const { result, unmount } = renderHook(useRemoteAutocomplete);
    act(() => result.current.actions.focus());
    act(unmount);
    expect(clearTimeout).toBeCalled();
  });

  it('returns error on request error', async () => {
    const { result } = renderHook(() => useRemoteAutocomplete({ urn: 'error' })); // error route
    act(() => result.current.actions.focus()); // updates shouldLoad = true
    act(() => jest.runAllTimers()); // invokes request after timer runs out

    await act(async () => {
      await waitFor(() => expect(result.current.loading).toBe(true));
    }); // waits for request to be finished

    expect(result.current.error).toEqual(new Error('404, test status text'));
    expect(result.current.loading).toBe(false);
  });
});
