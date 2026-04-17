import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../components/Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows hint text', () => {
    render(<Input hint="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });

  it('renders with icon', () => {
    render(
      <Input
        icon={<span data-testid="test-icon">Icon</span>}
        placeholder="With icon"
      />
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies error styles when error is present', () => {
    render(<Input error="Error" placeholder="Error input" />);
    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveClass('border-error');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" placeholder="Number" />);
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number');
  });

  it('accepts custom className', () => {
    render(<Input className="custom-input" placeholder="Custom" />);
    const wrapper = screen.getByPlaceholderText('Custom').closest('div');
    expect(wrapper?.parentElement).toHaveClass('custom-input');
  });
});
