import { FieldError } from 'react-hook-form';

import { describe, it, vi } from 'vitest';

import { fireEvent, render, screen } from '@testing-library/react';

import { Input } from './Input';

describe('Input component', () => {
  const mockId = 'testId';
  it('renders the component with provided props', () => {
    const mockRegister = vi.fn();
    const mockOptions = { minLength: 3 }; // Example options
    const mockLabel = 'testLabel';
    const mockPlaceholder = 'Enter something';
    const mockError = { message: 'Field is required' } as FieldError;

    render(
      <Input
        id={mockId}
        label={mockLabel}
        placeholder={mockPlaceholder}
        type='text'
        register={mockRegister}
        options={mockOptions}
        error={mockError}
      />
    );

    const inputElement = screen.getByPlaceholderText(mockPlaceholder);
    expect(inputElement).toBeInTheDocument();
  });

  it('displays an error message for an invalid email format', async () => {
    const mockRegister = vi.fn();
    const mockLabel = 'emailField';
    const mockPlaceholder = 'Enter email';
    const mockError = { message: 'Invalid email format' } as FieldError;

    render(
      <Input
        id={mockId}
        label={mockLabel}
        placeholder={mockPlaceholder}
        type='email'
        register={mockRegister}
        options={{}}
        error={mockError}
      />
    );

    const inputElement = screen.getByPlaceholderText(mockPlaceholder);
    fireEvent.change(inputElement, { target: { value: 'invalidemail' } });

    const errorText = await screen.findByText('Invalid email format');
    expect(errorText).toBeVisible();
  });

  it('does not display an error message for a valid email format', () => {
    const mockRegister = vi.fn();
    const mockLabel = 'emailField';
    const mockPlaceholder = 'Enter email';

    render(
      <Input
        id={mockId}
        label={mockLabel}
        placeholder={mockPlaceholder}
        type='email'
        register={mockRegister}
        options={{}}
        error={undefined}
      />
    );

    const inputElement = screen.getByPlaceholderText(mockPlaceholder);
    fireEvent.change(inputElement, { target: { value: 'valid@email.com' } });

    const errorText = screen.queryByText('Invalid email format');
    expect(errorText).toBeNull();
  });
});
