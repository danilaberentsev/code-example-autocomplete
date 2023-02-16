import { useCallback, useMemo, useReducer, useRef } from 'react';
import { useEffectOnUpdate, useOnClickOutside } from '@/hooks';
import type {
  AutocompleteState,
  AutocompleteAction,
  AutocompleteActionTypes,
  FromPayload,
} from './types';

export const actionTypes: { [key in Lowercase<AutocompleteActionTypes>]: Uppercase<key> } = {
  change: 'CHANGE',
  select: 'SELECT',
  focus: 'FOCUS',
  blur: 'BLUR',
  collect: 'COLLECT',
};

export const defaultState: AutocompleteState = {
  value: '',
  inFocus: false,
  shouldLoad: false,
  cache: {},
};

export function useAutocompleteState(initialState?: Partial<AutocompleteState>) {
  const reducer = (state: AutocompleteState, action: AutocompleteAction) => {
    const { type, payload = {} } = action;
    const { value = '', suggestions } = payload;

    const merge = (newState: Partial<AutocompleteState>) => ({ ...state, ...newState });
    const currCacheKey = state.value.trim().toLowerCase();
    const nextCacheKey = value.trim().toLowerCase();

    switch (type) {
      case (actionTypes.focus):
        return state.inFocus ? state : merge({ inFocus: true, shouldLoad: !state.cache[currCacheKey] });
      case (actionTypes.blur):
        return !state.inFocus ? state : merge({ inFocus: false });
      case (actionTypes.select):
        return merge({ inFocus: false, value });
      case (actionTypes.change):
        return merge({ inFocus: true, shouldLoad: !state.cache[nextCacheKey], value });
      case (actionTypes.collect):
        return merge({ shouldLoad: false, cache: { ...state.cache, [currCacheKey]: suggestions } });

      default: return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, { ...defaultState, ...initialState });

  return { state, dispatch };
}

export function useAutocomplete(initialState?: Partial<AutocompleteState>) {
  const { state, dispatch } = useAutocompleteState(initialState);

  const suggestions = useMemo(() => state.cache[state.value.trim().toLowerCase()], [state]);

  const actions = useMemo(() => ({
    focus: () => { dispatch({ type: actionTypes.focus }); },
    blur: () => { dispatch({ type: actionTypes.blur }); },
    select: (payload: FromPayload<'value'>) => { dispatch({ type: actionTypes.select, payload }); },
    change: (payload: FromPayload<'value'>) => { dispatch({ type: actionTypes.change, payload }); },
    collect: (payload: FromPayload<'suggestions'>) => { dispatch({ type: actionTypes.collect, payload }); },
  }), [dispatch]);

  const inputRef = useRef<HTMLInputElement>();
  const containerRef = useOnClickOutside<HTMLDivElement>(actions.blur);

  useEffectOnUpdate(useCallback(() => {
    if (!state.inFocus) {
      inputRef.current.blur();
    }
  }, [state.inFocus]));

  return { state, suggestions, actions, inputRef, containerRef };
}
