import { HTMLProps, Ref, useId } from 'react';
import type { AutocompleteSuggestion } from '@/Autocomplete';
import styles from './ExampleAutocompleteLayout.module.css';

export interface ExampleAutocompleteProps extends Omit<HTMLProps<HTMLInputElement>, 'onSelect' | 'placeholder'> {
  idKey?: keyof AutocompleteSuggestion
  titleKey?: keyof AutocompleteSuggestion
  placeholder?: string
  error?: Error
  loading?: boolean
  onSelect: (item: AutocompleteSuggestion) => void
  suggestions: AutocompleteSuggestion[]
  inFocus: boolean
  containerRef: Ref<HTMLDivElement>
  inputRef: Ref<HTMLInputElement>
}

export function ExampleAutocompleteLayout({
  idKey = 'id',
  titleKey = 'title',
  placeholder = 'SEARCH',
  error,
  loading,
  onSelect,
  suggestions,
  inFocus,
  containerRef,
  inputRef,
  ...rest
}: ExampleAutocompleteProps) {
  const id = useId();

  return (
    <div ref={containerRef} className={styles.container}>
      <label htmlFor={id} className={styles.inputContainer}>
        <div className={styles.placeholder}>{placeholder}</div>
        <input
          id={id}
          ref={inputRef}
          className={styles.input}
          placeholder=" "
          autoComplete="off"
          data-testid="input"
          {...rest}
        />
        {loading && (
          <div className={styles.loaderContainer} data-testid="loader">
            <i className={styles.loader} />
          </div>
        )}
      </label>
      {inFocus && !loading && suggestions && (
        <div className={styles.suggestions} data-testid="suggestions">
          {suggestions.length > 0 ? suggestions.map((item) => (
            <a
              className={styles.suggestion}
              key={item[idKey]}
              data-testid="suggestion"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onSelect) onSelect(item);
              }}
            >
              {item[titleKey]}
            </a>
          )) : 'Nothing found...'}
        </div>
      )}
      {error && (
        <div className={styles.error} data-testid="error">
          {error.toString()}
        </div>
      )}
    </div>
  );
}
