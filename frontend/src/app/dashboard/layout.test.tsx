import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardLayout from './layout';
import { useRouter, usePathname } from 'next/navigation';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock dynamic imports to render a simple div instead
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div>Dynamic Component</div>;
  return DynamicComponent;
});

// Mock translation provider hook
jest.mock('../../components/providers/LanguageProvider', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock GuidedTour and LiveEventEngine as they might have Side effects
jest.mock('../../components/GuidedTour', () => () => <div data-testid="guided-tour" />);
jest.mock('../../components/LiveEventEngine', () => () => <div data-testid="live-event-engine" />);

describe('DashboardLayout', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ maintenanceMode: false }),
    });
    
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'riq_token') return 'fake-token';
      if (key === 'riq_user') return JSON.stringify({ email: 'test@test.com', agencyName: 'Test Agency' });
      return null;
    });
    Storage.prototype.removeItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    jest.clearAllMocks();
  });

  it('renders sidebar navigation links', async () => {
    render(<DashboardLayout><div>Content</div></DashboardLayout>);
    
    // Check main links
    expect(screen.getByText('nav.overview')).toBeInTheDocument();
    expect(screen.getByText('nav.clients')).toBeInTheDocument();
    expect(screen.getByText('nav.reports')).toBeInTheDocument();
    expect(screen.getByText('nav.generate_report')).toBeInTheDocument();
    
    // Check user info rendered
    expect(screen.getByText('Test Agency')).toBeInTheDocument();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();

    // Check children rendering
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('redirects to login if no token is found', async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValue(null);
    render(<DashboardLayout><div>Content</div></DashboardLayout>);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('renders maintenance mode screen if maintenance is enabled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ maintenanceMode: true }),
    });

    render(<DashboardLayout><div>Content</div></DashboardLayout>);
    
    await waitFor(() => {
      expect(screen.getByText('System Under Maintenance')).toBeInTheDocument();
    });
  });

  it('handles logout properly', async () => {
    render(<DashboardLayout><div>Content</div></DashboardLayout>);
    
    const logoutBtn = screen.getByText('nav.log_out');
    await userEvent.click(logoutBtn);
    
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('riq_token');
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('riq_user');
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('toggles theme properly', async () => {
    render(<DashboardLayout><div>Content</div></DashboardLayout>);
    
    const themeToggle = screen.getByTitle(/Switch to/);
    await userEvent.click(themeToggle);
    
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('riq_theme', expect.any(String));
  });
});
