import { ExampleAutocompleteLayout, ExampleAutocompleteProps } from '@/ui';
import { useAutocomplete, AutocompleteSuggestion } from './useAutocomplete';

interface StaticAutocompleteProps {
  suggestions: AutocompleteSuggestion[]
}

export function StaticAutocomplete({
  idKey = 'id',
  titleKey = 'title',
  placeholder = 'SEARCH',
  onSelect,
  suggestions,
}: StaticAutocompleteProps & Pick<ExampleAutocompleteProps, 'idKey' | 'titleKey' | 'placeholder' | 'onSelect'>) {
  const { actions, state, inputRef, containerRef } = useAutocomplete();
  const filteredSuggestions = suggestions.filter((s) => s[titleKey].includes(state.value.trim().toLowerCase()));

  return (
    <ExampleAutocompleteLayout
      idKey={idKey}
      titleKey={titleKey}
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
        actions.select({ value: item[titleKey] });
        if (onSelect) onSelect(item);
      }}
    />
  );
}
