import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleAutocompleteLayout, ExampleAutocompleteProps } from '@/ui';

const suggestions = [{ id: 'foo', name: 'bar' }];

const options: ExampleAutocompleteProps = {
  inputRef: createRef<HTMLInputElement>(),
  containerRef: createRef<HTMLDivElement>(),
  suggestions,
  onSelect: jest.fn(),
  placeholder: 'foo',
  inFocus: false,
  loading: false,
  error: null,
};

describe('Autocomplete component', () => {
  it('renders properly in default state', () => {
    render(<ExampleAutocompleteLayout {...options} />);

    expect(screen.getByText(/foo/i)).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(screen.queryByTestId('suggestions')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  it('renders properly with suggestions while focused', () => {
    render(<ExampleAutocompleteLayout {...options} inFocus />);
    const suggestionNodes = screen.getAllByTestId('suggestion');
    expect(suggestionNodes.length).toBe(1);
    expect(suggestionNodes[0]).toContainHTML('bar');
  });

  it('renders properly with empty suggestions while focused', () => {
    render(<ExampleAutocompleteLayout {...options} inFocus suggestions={[]} />);
    expect(screen.getByTestId('suggestions')).toContainHTML('Nothing found...');
  });

  it('renders properly with loading', () => {
    render(<ExampleAutocompleteLayout {...options} loading />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders properly with error', () => {
    const error = new Error('Some error');
    render(<ExampleAutocompleteLayout {...options} error={error} />);
    expect(screen.getByTestId('error')).toContainHTML(error.toString());
  });

  it('invokes onSelect function after selecting suggestion', () => {
    render(<ExampleAutocompleteLayout {...options} inFocus />);

    const [suggestionNode] = screen.getAllByTestId('suggestion');
    expect(suggestionNode).toContainHTML('bar');

    fireEvent.click(suggestionNode);
    expect(options.onSelect).toBeCalledWith(suggestions[0]);
  });
});
