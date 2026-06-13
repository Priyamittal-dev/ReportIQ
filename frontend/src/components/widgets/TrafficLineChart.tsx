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
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={11} tickMargin={10} />
          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickMargin={10} />
          <Tooltip 
            contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Area type="monotone" dataKey="prev" stroke="rgba(255,255,255,0.2)" fill="transparent" strokeDasharray="5 5" name="Previous Period" />
          <Area type="monotone" dataKey="sessions" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" name="Current Period" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
