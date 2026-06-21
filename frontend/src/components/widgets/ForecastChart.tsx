import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Last Month', value: 3100, isForecast: false },
  { month: 'This Month', value: 4200, isForecast: false },
  { month: 'Next Month (Predicted)', value: 5400, isForecast: true },
];

export function ForecastChart({ color = '#10b981' }: { color?: string }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>AI Predictive Forecast</h4>
        <span className="badge badge-ready" style={{ fontSize: 10, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          +28% Predicted Growth
        </span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
            cursor={{ stroke: 'var(--border)' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
