import { render, screen, fireEvent } from '@testing-library/react';
import ClientsPage from './page';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: '1', name: 'Test Client', email: 'test@client.com', timezone: 'UTC', _count: { reports: 0 } }
    ]),
  })
) as jest.Mock;

describe('ClientsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => 'mock-token');
  });

  it('renders the Clients page title', async () => {
    render(<ClientsPage />);
    
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Manage your agency\'s clients and their configurations.')).toBeInTheDocument();
  });

  it('opens the Add Client modal when clicking the button', async () => {
    render(<ClientsPage />);
    
    const addButton = screen.getByText('Add Client');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Add New Client')).toBeInTheDocument();
    expect(screen.getByText('Client Name *')).toBeInTheDocument();
  });
});
