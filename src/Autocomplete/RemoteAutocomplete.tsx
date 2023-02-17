import { ExampleAutocompleteLayout, ExampleAutocompleteProps } from '@/ui';
import { useRemoteAutocomplete, UseRemoteAutocompleteProps } from './useAutocomplete';

export function RemoteAutocomplete({
  idKey = 'id',
  titleKey = 'title',
  dataKey,
  searchKey,
  placeholder = 'SEARCH',
  onSelect,
  urn,
}: Pick<ExampleAutocompleteProps, 'idKey' | 'titleKey' | 'placeholder' | 'onSelect'> & UseRemoteAutocompleteProps) {
  const {
    actions,
    state,
    suggestions,
    loading,
    error,
    inputRef,
    containerRef,
  } = useRemoteAutocomplete({ urn, searchKey, dataKey });

  return (
    <ExampleAutocompleteLayout
      idKey={idKey}
      titleKey={titleKey}
      inputRef={inputRef}
      containerRef={containerRef}
      inFocus={state.inFocus}
      suggestions={suggestions}
      placeholder={placeholder}
      value={state.value}
      onFocus={actions.focus}
      onBlur={(e) => { e.preventDefault(); }}
      onChange={(e) => { actions.change({ value: e.currentTarget.value }); }}
      onSelect={(item) => {
        actions.select({ value: item[titleKey] });
        if (onSelect) onSelect(item);
      }}
      loading={loading}
      error={error}
    />
  );
}
