export type AutocompleteActionTypes = 'CHANGE' | 'FOCUS' | 'BLUR' | 'SELECT' | 'COLLECT';

export interface AutocompleteSuggestion {
  [key: string]: any
}

export type AutocompleteSuggestions = AutocompleteSuggestion[];

export interface AutocompleteState {
  inFocus: boolean
  value: string
  shouldLoad: boolean
  cache: {
    [key: string]: AutocompleteSuggestions
  }
}

export interface Payload {
  value?: string
  suggestions?: AutocompleteSuggestions
}

export type FromPayload<Key extends keyof Payload> = Required<Pick<Payload, Key>>;

export interface AutocompleteAction {
  type: AutocompleteActionTypes
  payload?: Payload
}
