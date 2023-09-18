import { beforeEach, describe, it, vi } from 'vitest';

import { RenderResult, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '.';

describe('Button component', () => {
  describe('test for basic props', () => {
    const type = 'button';
    const loading = false;
    const onClickButton = vi.fn();

    it('render Button element', () => {
      const { getByText } = render(
        <Button type={type} loading={loading} onClick={onClickButton}>
          TestButton
        </Button>
      );
      expect(getByText('TestButton')).toBeInTheDocument();
    });

    it('render Button element with corresponding text content', () => {
      const { getByText } = render(
        <Button type={type} loading={loading} onClick={onClickButton}>
          TestButton
        </Button>
      );
      expect(getByText('TestButton')).toHaveTextContent('TestButton');
    });

    it('Button has correct type attribute', () => {
      const { getByText } = render(
        <Button type={type} loading={loading} onClick={onClickButton}>
          TestButton
        </Button>
      );
      expect(getByText('TestButton')).toHaveAttribute('type', 'button');
    });
  });
  describe('test for loading/disabled state', () => {
    const type = 'button';
    let loading = false;
    const onClickButton = vi.fn();
    let button: HTMLButtonElement;
    let renderOption: RenderResult;

    beforeEach(() => {
      loading = false;
      renderOption = render(
        <Button type={type} loading={loading} onClick={onClickButton}>
          TestButton
        </Button>
      );
      button = screen.getByText('TestButton');
    });

    it('user click on button - called onChange callback', async () => {
      await userEvent.click(button);
      expect(onClickButton).toBeCalledTimes(1);
    });

    it('user click on button with loading state - called onChange callback and handle disabled state', async () => {
      await userEvent.click(button);
      expect(onClickButton).toBeCalledTimes(1);
      loading = true;
      renderOption.rerender(
        <Button type={type} loading={loading} onClick={onClickButton}>
          TestButton
        </Button>
      );

      expect(button).toBeDisabled();
    });
  });
});
