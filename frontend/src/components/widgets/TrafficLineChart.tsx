import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { date: '01 May', sessions: 2400, prev: 1800 },
  { date: '08 May', sessions: 3100, prev: 2100 },
  { date: '15 May', sessions: 2900, prev: 2600 },
  { date: '22 May', sessions: 4200, prev: 2800 },
  { date: '29 May', sessions: 5100, prev: 3200 },
];

export function TrafficLineChart({ color = '#8a2be2' }: { color?: string }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>Sessions Over Time</h4>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Area type="monotone" dataKey="prev" stroke="var(--text-muted)" fill="transparent" strokeDasharray="5 5" name="Previous Period" />
          <Area type="monotone" dataKey="sessions" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" name="Current Period" animationDuration={1000} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
