'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Wand2, BarChart3, AlertCircle, FileText } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

const COLORS = ['#8a2be2', '#00e5ff', '#ff00ff', '#ff3366', '#ff9900'];

export default function MagicImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      
      // Send only the first 200 lines to avoid token limits for massive CSVs
      const truncatedText = text.split('\n').slice(0, 200).join('\n');

      const token = localStorage.getItem('riq_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/reports/magic-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ csvText: truncatedText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate dashboard');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (chartConfig: any, index: number) => {
    const { title, type, dataKey, xAxisKey, data } = chartConfig;

    if (!data || data.length === 0) return null;

    let ChartComponent;
    switch (type) {
      case 'line':
        ChartComponent = (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid #333' }} />
              <Line type="monotone" dataKey={dataKey} stroke={COLORS[index % COLORS.length]} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
        break;
      case 'pie':
        ChartComponent = (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey={dataKey} nameKey={xAxisKey} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} label>
                {data.map((entry: any, i: number) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid #333' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        break;
      case 'area':
        ChartComponent = (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid #333' }} />
              <Area type="monotone" dataKey={dataKey} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
        break;
      case 'bar':
      default:
        ChartComponent = (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid #333', color: '#fff' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
              <Bar dataKey={dataKey} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className="card"
        style={{ padding: '24px', flex: '1 1 calc(50% - 24px)', minWidth: '300px' }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>{title}</h3>
        {ChartComponent}
      </motion.div>
    );
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wand2 size={32} color="var(--accent)" /> Magic Import
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
          Upload raw CSV data and let AI instantly generate a beautiful, interactive dashboard with key insights.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!dashboardData && !loading && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card"
            style={{ padding: '60px', textAlign: 'center', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--border)' }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(138,43,226,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <UploadCloud size={40} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>Upload your Data</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
              Drag and drop a CSV file here, or click to browse. We'll analyze the data and build a custom report.
            </p>
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {file ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-2)', padding: '12px 24px', borderRadius: '8px' }}>
                  <FileText size={20} color="var(--accent)" />
                  <span style={{ fontWeight: 500 }}>{file.name}</span>
                </div>
                <button className="btn btn-primary" onClick={processFile} style={{ marginTop: '16px', padding: '12px 32px', fontSize: '16px' }}>
                  <Wand2 size={20} /> Generate Magic Dashboard
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => fileInputRef.current?.click()} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                Select File
              </button>
            )}

            {error && (
              <div style={{ marginTop: '24px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '8px' }}>
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <Wand2 size={64} color="var(--accent)" />
            </motion.div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px' }}>Analyzing your data...</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Our AI is extracting insights and building charts.</p>
          </motion.div>
        )}

        {dashboardData && !loading && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Generated Insights</h2>
              <button className="btn" onClick={() => setDashboardData(null)} style={{ background: 'var(--bg-2)' }}>
                Start Over
              </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <div className="card" style={{ padding: '24px', flex: '1 1 400px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} color="var(--accent)" /> Executive Summary
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px' }}>
                  {dashboardData.summary}
                </p>
              </div>

              <div className="card" style={{ padding: '24px', flex: '1 1 400px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={20} color="#00e5ff" /> Key Insights
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dashboardData.insights?.map((insight: string, idx: number) => (
                    <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,229,255,0.1)', color: '#00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 700 }}>
                        {idx + 1}
                      </div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.5 }}>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              {dashboardData.charts?.map((chart: any, index: number) => renderChart(chart, index))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
