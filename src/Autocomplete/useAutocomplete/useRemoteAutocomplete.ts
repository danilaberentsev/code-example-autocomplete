import { useEffect } from 'react';
import { useDebouncedRequest } from '@/hooks';
import { useAutocomplete } from './useAutocomplete';
import type { AutocompleteState, AutocompleteSuggestions } from './types';

export interface UseRemoteAutocompleteProps {
  urn?: string
  searchKey?: string
  dataKey?: string
  initialState?: Partial<AutocompleteState>
}

export function useRemoteAutocomplete({
  urn,
  searchKey = 'q',
  dataKey,
  initialState
}: UseRemoteAutocompleteProps = {}) {
  const { debounced, loading, error, abort, timerRef } = useDebouncedRequest<AutocompleteSuggestions>({ urn, dataKey });
  const { actions, state, inputRef, containerRef, suggestions } = useAutocomplete(initialState);

  useEffect(() => {
    if (state.shouldLoad) {
      debounced({ [searchKey]: state.value })
        .then((data) => actions.collect({ suggestions: data }));
    }
  }, [state.shouldLoad, state.value, actions, debounced, searchKey]);

  useEffect(() => {
    // abort ongoing request if next value has cached suggestions
    if (suggestions && timerRef.current) abort();
  }, [abort, suggestions, timerRef]);

  useEffect(() => abort, [abort]);

  return {
    actions,
    state,
    suggestions,
    inputRef,
    containerRef,
    loading,
    error,
  };
}
