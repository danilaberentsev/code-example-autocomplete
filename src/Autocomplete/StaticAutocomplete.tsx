import { ExampleAutocompleteLayout, ExampleAutocompleteProps } from '@/ui';
import { useAutocomplete, AutocompleteSuggestion } from './useAutocomplete';

interface StaticAutocompleteProps {
  suggestions: AutocompleteSuggestion[]
}

export function StaticAutocomplete({
  idKey = 'id',
  nameKey = 'name',
  placeholder = 'SEARCH',
  onSelect,
  suggestions,
}: StaticAutocompleteProps & Pick<ExampleAutocompleteProps, 'idKey' | 'nameKey' | 'placeholder' | 'onSelect'>) {
  const { actions, state, inputRef, containerRef } = useAutocomplete();
  const filteredSuggestions = suggestions.filter((s) => s[nameKey].includes(state.value.trim().toLowerCase()));

  return (
    <ExampleAutocompleteLayout
      idKey={idKey}
      nameKey={nameKey}
      inputRef={inputRef}
      containerRef={containerRef}
      inFocus={state.inFocus}
      suggestions={filteredSuggestions}
      placeholder={placeholder}
      value={state.value}
      onFocus={actions.focus}
      onBlur={(e) => { e.preventDefault(); }}
      onChange={(e) => { actions.change({ value: e.currentTarget.value }); }}
      onSelect={(item) => {
        actions.select({ value: item[nameKey] });
        if (onSelect) onSelect(item);
      }}
    />
  );
}
