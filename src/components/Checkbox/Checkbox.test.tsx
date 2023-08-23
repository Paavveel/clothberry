import { beforeEach, describe, it, vi } from 'vitest';

import { RenderResult, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from './Checkbox';

describe('CheckBox component', () => {
  describe('test for basic props', () => {
    const checkboxTestId = 'checkbox';
    const checkboxValue = false;
    const checkboxTitle = 'Test title';
    const checkboxHtmlFor = 'Test htmlFor';
    const onChangeCheckbox = vi.fn();
    let label: HTMLLabelElement;
    let checkbox: HTMLInputElement;
    let title: HTMLParagraphElement;

    beforeEach(() => {
      render(
        <Checkbox
          data-testid={checkboxTestId}
          value={checkboxValue}
          title={checkboxTitle}
          htmlFor={checkboxHtmlFor}
          onChange={onChangeCheckbox}
        />
      );
      label = screen.getByTestId(checkboxTestId);
      checkbox = screen.getByRole('checkbox');
      title = screen.getByText(checkboxTitle);
    });

    it('label has correct htmlFor attribute', () => {
      expect(label).toHaveAttribute('for', checkboxHtmlFor);
    });

    it('checkbox has correct id attribute', () => {
      expect(checkbox).toHaveAttribute('id', checkboxHtmlFor);
    });

    it('title has correct text content', () => {
      expect(title).toHaveTextContent(checkboxTitle);
    });

    it('checkbox has correct default checked value', () => {
      expect(checkbox).not.toBeChecked();
    });

    it('user click at title - called onChange callback', async () => {
      await userEvent.click(title);
      expect(onChangeCheckbox).toBeCalledTimes(1);
    });

    it('user click at checkbox - called onChange callback', async () => {
      await userEvent.click(checkbox);
      expect(onChangeCheckbox).toBeCalledTimes(1);
    });
  });
  describe('test for change checked state', () => {
    const checkboxTitle = 'Test title';
    const checkboxHtmlFor = 'Test htmlFor';
    let checkboxValue = false;
    const onChangeCheckbox = vi.fn();
    let checkbox: HTMLInputElement;
    let renderOption: RenderResult;

    beforeEach(() => {
      checkboxValue = false;
      renderOption = render(
        <Checkbox value={checkboxValue} title={checkboxTitle} htmlFor={checkboxHtmlFor} onChange={onChangeCheckbox} />
      );
      checkbox = screen.getByRole('checkbox');
    });

    it('user click at checkbox - called onChange callback', async () => {
      await userEvent.click(checkbox);
      expect(onChangeCheckbox).toBeCalledTimes(1);
      checkboxValue = true;
      renderOption.rerender(
        <Checkbox value={checkboxValue} title={checkboxTitle} htmlFor={checkboxHtmlFor} onChange={onChangeCheckbox} />
      );

      expect(checkbox).toBeChecked();
    });
  });
});
