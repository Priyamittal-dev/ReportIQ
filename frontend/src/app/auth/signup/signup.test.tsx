import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from './page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignupPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    global.fetch = jest.fn();
    Storage.prototype.setItem = jest.fn();
    jest.clearAllMocks();
  });

  it('renders signup page correctly', () => {
    render(<SignupPage />);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Agency Name*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Work Email*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password*')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByText('Sign up with Google')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<SignupPage />);
    const passwordInput = screen.getByPlaceholderText('Password*');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const buttons = screen.getAllByRole('button');
    const toggleBtn = buttons.find(b => !b.textContent?.includes('Create account'));
    
    await userEvent.click(toggleBtn!);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await userEvent.click(toggleBtn!);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles successful signup needing verification', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Verification email sent', requiresVerification: true }),
    });

    render(<SignupPage />);
    
    await userEvent.type(screen.getByPlaceholderText('Agency Name*'), 'My Agency');
    await userEvent.type(screen.getByPlaceholderText('Work Email*'), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText('Password*'), 'password123');
    await userEvent.click(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Verification email sent')).toBeInTheDocument();
      expect(screen.getByText('Check your email')).toBeInTheDocument();
    });
  });

  it('handles successful signup with direct login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: 'token123', user: { id: 1 } }),
    });

    render(<SignupPage />);
    
    await userEvent.type(screen.getByPlaceholderText('Agency Name*'), 'My Agency');
    await userEvent.type(screen.getByPlaceholderText('Work Email*'), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText('Password*'), 'password123');
    await userEvent.click(screen.getByText('Create account'));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('riq_token', 'token123');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on failed signup', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email already exists' }),
    });

    render(<SignupPage />);
    
    await userEvent.type(screen.getByPlaceholderText('Agency Name*'), 'My Agency');
    await userEvent.type(screen.getByPlaceholderText('Work Email*'), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText('Password*'), 'password123');
    await userEvent.click(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
