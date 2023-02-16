import { fireEvent, renderHook } from '@testing-library/react';
import { useOnClickOutside } from '@/hooks';

function setup() {
  const target = document.createElement('div');
  document.body.appendChild(target);
  const outside = document.createElement('div');
  document.body.appendChild(outside);
  const callback = jest.fn();
  const { unmount, result } = renderHook(() => useOnClickOutside(callback));
  result.current.current = target;

  return { unmount, outside, callback, target };
}

describe('useOutsideClick', () => {
  it('invokes callback on click outside and escape key press', () => {
    const { outside, callback, target } = setup();

    expect(callback).toHaveBeenCalledTimes(0);
    fireEvent.click(outside);
    expect(callback).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(outside, { key: 'Escape' });
    expect(callback).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(target, { key: 'Escape' });
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('do nothing when clicked on target', () => {
    const { callback, target } = setup();

    expect(callback).toHaveBeenCalledTimes(0);
    fireEvent.click(target);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('removes event listeners on unmount', () => {
    const { unmount, outside, callback } = setup();
    jest.spyOn(document, 'removeEventListener');
    unmount();
    expect(document.removeEventListener).toBeCalledTimes(2);

    fireEvent.click(outside);
    expect(callback).toBeCalledTimes(0);
  });
});
