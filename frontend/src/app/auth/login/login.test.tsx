import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    global.fetch = jest.fn();
    Storage.prototype.setItem = jest.fn();
    jest.clearAllMocks();
  });

  it('renders login page correctly', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Work Email*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password*')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/1-Click Live Demo Evaluation Login/i)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText('Password*');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the toggle button by role or closest reliable selector. 
    // It's the only button in the form besides "Sign in". We can find it by the sibling relation or icon.
    // For simplicity, let's select by the type="button" that isn't the demo login.
    const buttons = screen.getAllByRole('button');
    const toggleBtn = buttons.find(b => !b.textContent?.includes('1-Click') && !b.textContent?.includes('Sign in'));
    
    await userEvent.click(toggleBtn!);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await userEvent.click(toggleBtn!);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles standard email/password login successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: 'token123', user: { id: 1 } }),
    });

    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText('Work Email*'), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText('Password*'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
    });

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('riq_token', 'token123');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on failed login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText('Work Email*'), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText('Password*'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('handles 1-Click Demo login successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: 'demo-token', user: { id: 'demo1' } }),
    });

    render(<LoginPage />);
    await userEvent.click(screen.getByText(/1-Click Live Demo Evaluation Login/i));

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/demo-login'), expect.any(Object));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('riq_token', 'demo-token');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error on failed demo login', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />);
    await userEvent.click(screen.getByText(/1-Click Live Demo Evaluation Login/i));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
