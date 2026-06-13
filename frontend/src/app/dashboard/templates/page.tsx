'use client';
import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Save, LayoutTemplate, X, FileText, BarChart2, Hash, ArrowUpRight } from 'lucide-react';
import { TrafficLineChart } from '@/components/widgets/TrafficLineChart';
import { SourceBarChart } from '@/components/widgets/SourceBarChart';

// Initial default layout matching the MVP
const DEFAULT_LAYOUT = [
  { id: 'w-header', type: 'header', title: 'Executive Summary' },
  { id: 'w-ai-summary', type: 'ai-summary', title: 'AI Insights' },
  { id: 'w-metrics', type: 'metrics-grid', title: 'KPI Grid' },
  { id: 'w-chart-1', type: 'traffic-chart', title: 'Traffic Over Time' },
];

const AVAILABLE_WIDGETS = [
  { type: 'header', title: 'Section Header', icon: <Hash size={16} /> },
  { type: 'ai-summary', title: 'AI Insights', icon: <FileText size={16} /> },
  { type: 'metrics-grid', title: 'KPI Grid', icon: <LayoutTemplate size={16} /> },
  { type: 'traffic-chart', title: 'Traffic Over Time', icon: <BarChart2 size={16} /> },
  { type: 'source-chart', title: 'Traffic Sources', icon: <BarChart2 size={16} /> },
];

export default function TemplateBuilderPage() {
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [showPicker, setShowPicker] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState({ primaryColor: '#8a2be2', accentColor: '#00e5ff' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('riq_user') || '{}');
    if (user.primaryColor) {
      setTheme({ primaryColor: user.primaryColor, accentColor: user.accentColor || '#00e5ff' });
    }
    
    const savedLayout = localStorage.getItem('riq_custom_layout');
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    }
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addWidget = (type: string, title: string) => {
    const newWidget = { id: `w-${Date.now()}`, type, title };
    setLayout([...layout, newWidget]);
    setShowPicker(false);
  };

  const removeWidget = (id: string) => {
    setLayout(layout.filter(w => w.id !== id));
  };

  const handleSave = () => {
    localStorage.setItem('riq_custom_layout', JSON.stringify(layout));
    alert('Template layout saved! Future reports will use this layout.');
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Template Builder</h1>
          <p className="page-subtitle">Drag and drop widgets to build your custom client report layout.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">
          <Save size={16} /> Save Template
        </button>
      </div>

      <div className="page-body" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        
        {/* BUILDER CANVAS */}
        <div style={{ flex: 1 }}>
          <div style={{ padding: 24, background: 'var(--bg-1)', borderRadius: 16, border: '1px solid var(--border)' }}>
            
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={layout.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {layout.map((widget) => (
                    <SortableWidget 
                      key={widget.id} 
                      widget={widget} 
                      onRemove={() => removeWidget(widget.id)}
                      theme={theme}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button 
              onClick={() => setShowPicker(true)}
              style={{ width: '100%', padding: 24, marginTop: 16, borderRadius: 12, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'var(--t-fast)' }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Plus size={18} /> Add Widget
            </button>
          </div>
        </div>

        {/* WIDGET PICKER MODAL/SIDEBAR */}
        {showPicker && (
          <div className="card" style={{ width: 320, position: 'sticky', top: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Available Widgets</h3>
              <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {AVAILABLE_WIDGETS.map((w, i) => (
                <button 
                  key={i}
                  onClick={() => addWidget(w.type, w.title)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', transition: 'var(--t-fast)' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <div style={{ color: 'var(--accent)' }}>{w.icon}</div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{w.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// SORTABLE WRAPPER COMPONENT
function SortableWidget({ widget, onRemove, theme }: { widget: any, onRemove: () => void, theme: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: 'var(--bg-0)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    position: 'relative' as any,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button {...attributes} {...listeners} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'grab', display: 'flex' }}>
            <GripVertical size={16} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{widget.title}</span>
        </div>
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ padding: 24, pointerEvents: 'none' }}>
        <WidgetPreview type={widget.type} theme={theme} />
      </div>
    </div>
  );
}

// WIDGET PREVIEW RENDERER
function WidgetPreview({ type, theme }: { type: string, theme: any }) {
  switch (type) {
    case 'header':
      return <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>[Section Header]</h2>;
    case 'ai-summary':
      return (
        <div style={{ background: `linear-gradient(135deg, ${theme.primaryColor}15, transparent)`, border: `1px solid ${theme.primaryColor}40`, padding: 20, borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: theme.primaryColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>AI Insights</div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Placeholder text for the GPT-4o generated executive summary. This will be replaced with real data during report generation.</p>
        </div>
      );
    case 'metrics-grid':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Metric Name</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>1,234</div>
              <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 4, display: 'flex', alignItems: 'center' }}>
                <ArrowUpRight size={12} /> 12%
              </div>
            </div>
          ))}
        </div>
      );
    case 'traffic-chart':
      return <TrafficLineChart color={theme.primaryColor} />;
    case 'source-chart':
      return <SourceBarChart color={theme.accentColor} />;
    default:
      return <div>Unknown Widget</div>;
  }
}
