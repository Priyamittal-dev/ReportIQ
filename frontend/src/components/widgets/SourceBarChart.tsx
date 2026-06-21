import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { source: 'Organic', sessions: 4200 },
  { source: 'Direct', sessions: 2100 },
  { source: 'Social', sessions: 1100 },
  { source: 'Referral', sessions: 850 },
  { source: 'Email', sessions: 450 },
];

export function SourceBarChart({ color = '#00e5ff' }: { color?: string }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>Top Traffic Sources</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
          <YAxis dataKey="source" type="category" stroke="var(--text-secondary)" fontSize={11} width={60} tickMargin={10} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: 'var(--border)' }}
            contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Bar dataKey="sessions" fill={color} radius={[0, 4, 4, 0]} barSize={24} animationDuration={1000} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
