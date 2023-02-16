import { renderHook, act } from '@testing-library/react';
import { useAutocompleteState, useAutocomplete, defaultState, actionTypes } from '@/Autocomplete';

const suggestions = [{ id: 'foo', name: 'bar' }];

describe('useAutocompleteState', () => {
  it('returns state and dispatch and handles state update through dispatch', () => {
    const { result } = renderHook(useAutocompleteState);
    expect(result.current.state).toEqual(defaultState);
    expect(result.current.dispatch).not.toBeNull();
    act(() => result.current.dispatch({ type: actionTypes.focus }));
    expect(result.current.state).toEqual({ ...defaultState, inFocus: true, shouldLoad: true });
  });
});

describe('useAutocomplete hook', () => {
  describe('focus action', () => {
    it('sets shouldLoad=true if cache empty', () => {
      const { result } = renderHook(useAutocomplete);

      act(() => result.current.actions.focus());
      expect(result.current.state).toEqual({ ...defaultState, inFocus: true, shouldLoad: true });
    });

    it('sets shouldLoad=false with existing cache', () => {
      const initial = { value: 'foo', cache: { foo: suggestions } };
      const { result } = renderHook(() => useAutocomplete(initial));

      act(() => result.current.actions.focus());
      expect(result.current.state).toEqual({ ...defaultState, ...initial, inFocus: true });
    });
  });

  describe('change action', () => {
    it('sets shouldLoad=true if cache empty', () => {
      const { result } = renderHook(useAutocomplete);

      act(() => result.current.actions.change({ value: 'foo' }));
      expect(result.current.state).toEqual({ ...defaultState, shouldLoad: true, inFocus: true, value: 'foo' });
    });

    it('sets shouldLoad=false with existing cache', () => {
      const initial = { cache: { foo: suggestions } };
      const { result } = renderHook(() => useAutocomplete(initial));

      act(() => result.current.actions.change({ value: 'foo' }));
      expect(result.current.state).toEqual({ ...defaultState, ...initial, inFocus: true, value: 'foo' });
    });

    it('returns suggestions from cache for current value ignoring letter case and whitespaces', () => {
      const initial = { cache: { foo: suggestions } };
      const { result } = renderHook(() => useAutocomplete(initial));

      expect(result.current.suggestions).toBeUndefined();
      act(() => result.current.actions.change({ value: 'FoO' }));
      expect(result.current.suggestions).toEqual(initial.cache.foo);
      act(() => result.current.actions.change({ value: ' fOo ' }));
      expect(result.current.suggestions).toEqual(initial.cache.foo);
    });
  });

  describe('collect action', () => {
    it('adds suggestions into cache, sets shouldLoad=false', () => {
      const { result } = renderHook(() => useAutocomplete({ value: 'foo', shouldLoad: true }));

      act(() => result.current.actions.collect({ suggestions }));
      expect(result.current.state).toEqual({
        ...defaultState,
        value: 'foo',
        shouldLoad: false,
        cache: { foo: suggestions }
      });
    });
  });

  describe('select action', () => {
    it('updates value, removes inFocus', () => {
      const { result } = renderHook(useAutocomplete);

      act(() => result.current.actions.select({ value: 'foo' }));
      expect(result.current.state).toEqual({
        ...defaultState,
        inFocus: false,
        value: 'foo'
      });
    });
  });

  describe('blur action', () => {
    it('sets inFocus=false and calls native blur event on input through ref', () => {
      const { result } = renderHook(() => useAutocomplete({ inFocus: true }));
      const input = document.createElement('input');
      input.blur = jest.fn();
      result.current.inputRef.current = input;

      act(() => result.current.actions.blur());
      expect(result.current.state).toEqual({ ...defaultState, inFocus: false });
      expect(result.current.inputRef.current.blur).toBeCalled();
    });
  });
});
