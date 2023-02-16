import { act, renderHook } from '@testing-library/react';
import { useEffectOnUpdate } from '@/hooks';

describe('useEffectOnUpdate hook', () => {
  it('invokes callback on each update except first', () => {
    const callback = jest.fn();
    // creates new callback on each render -> triggers useEffect
    const { rerender } = renderHook(() => useEffectOnUpdate(() => callback()));

    expect(callback).not.toBeCalled();
    act(rerender);
    expect(callback).toBeCalled();
    act(rerender);
    expect(callback).toBeCalledTimes(2);
  });
});
