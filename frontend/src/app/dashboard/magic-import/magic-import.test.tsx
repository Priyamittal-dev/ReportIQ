import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MagicImportPage from './page';

// Mock recharts to avoid ResizeObserver issues in JSDOM
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: () => <div data-testid="bar-chart" />,
  LineChart: () => <div data-testid="line-chart" />,
  PieChart: () => <div data-testid="pie-chart" />,
  AreaChart: () => <div data-testid="area-chart" />,
  Bar: () => null,
  Line: () => null,
  Pie: () => null,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null,
}));

describe('MagicImportPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    Storage.prototype.getItem = jest.fn().mockReturnValue('fake-token');
    // JSDOM does not implement File.prototype.text
    File.prototype.text = jest.fn().mockResolvedValue('mock csv content');
    jest.clearAllMocks();
  });

  it('renders initial upload state', () => {
    render(<MagicImportPage />);
    expect(screen.getByText('Upload your Data')).toBeInTheDocument();
    expect(screen.getByText('Select File')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(<MagicImportPage />);
    
    // Create a mock file
    const file = new File(['csv,content\n1,2'], 'test.csv', { type: 'text/csv' });
    
    // Find the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, file);
    
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    expect(screen.getByText('Generate Magic Dashboard')).toBeInTheDocument();
  });

  it('processes file and displays dashboard successfully', async () => {
    const mockDashboardData = {
      summary: 'Mock Summary',
      insights: ['Insight 1', 'Insight 2'],
      charts: [
        { title: 'Chart 1', type: 'bar', data: [{ name: 'A', value: 10 }] }
      ]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });

    render(<MagicImportPage />);
    
    const file = new File(['csv,content\n1,2'], 'test.csv', { type: 'text/csv' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, file);
    
    await userEvent.click(screen.getByText('Generate Magic Dashboard'));

    await waitFor(() => {
      expect(screen.getByText('Generated Insights')).toBeInTheDocument();
      expect(screen.getByText('Mock Summary')).toBeInTheDocument();
      expect(screen.getByText('Insight 1')).toBeInTheDocument();
      expect(screen.getByText('Chart 1')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  it('displays error message on failed upload', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<MagicImportPage />);
    
    const file = new File(['csv,content\n1,2'], 'test.csv', { type: 'text/csv' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, file);
    
    await userEvent.click(screen.getByText('Generate Magic Dashboard'));

    await waitFor(() => {
      expect(screen.getByText('Failed to generate dashboard')).toBeInTheDocument();
    });
  });
});
