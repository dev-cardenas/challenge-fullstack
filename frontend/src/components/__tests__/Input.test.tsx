import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  const mockRegister = {
    name: 'test-input',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  };

  it('renders with label and placeholder', () => {
    render(
      <Input
        label="Test Label"
        placeholder="Test Placeholder"
        register={mockRegister}
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(
      <Input
        label="Test Label"
        register={mockRegister}
        error="This is an error"
      />
    );

    expect(screen.getByText('This is an error')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('error');
  });

  it('uses custom type', () => {
    render(
      <Input
        label="Password"
        type="password"
        register={mockRegister}
      />
    );

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });
});
