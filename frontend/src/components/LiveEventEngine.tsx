'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Sparkles, CheckCircle2, TrendingUp, AlertTriangle, Zap, Download } from 'lucide-react';

const EVENTS = [
  {
    title: 'Data Synced',
    message: 'Meta Ads performance data for Client XYZ successfully pulled.',
    icon: <CheckCircle2 size={20} color="#10b981" />
  },
  {
    title: 'AI Insight Generated',
    message: 'We noticed a 15% increase in CPC for Acme Corp. Check the dashboard.',
    icon: <Sparkles size={20} color="#8a2be2" />
  },
  {
    title: 'Report Ready',
    message: 'Q3 Executive Summary for Beta LLC has been generated and is ready for review.',
    icon: <Zap size={20} color="#f59e0b" />
  },
  {
    title: 'Client Viewed Portal',
    message: 'John Doe from Delta Co. is currently viewing their dashboard.',
    icon: <TrendingUp size={20} color="#00e5ff" />
  },
  {
    title: 'Integration Warning',
    message: 'Google Analytics API rate limit approaching. Queuing requests.',
    icon: <AlertTriangle size={20} color="#f59e0b" />
  },
  {
    title: 'Export Completed',
    message: 'Your bulk PDF export of 12 reports is ready for download.',
    icon: <Download size={20} color="#8a2be2" />
  }
];

export default function LiveEventEngine() {
  useEffect(() => {
    // Check if the user is in the dashboard. If they leave the tab, it might keep firing,
    // but React's synthetic timers usually throttle.
    
    const triggerEvent = () => {
      // Pick a random event
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      
      toast(event.title, {
        description: event.message,
        icon: event.icon,
        duration: 5000,
      });

      // Schedule the next event between 15 and 45 seconds from now
      const nextDelay = Math.floor(Math.random() * 30000) + 15000;
      timer = setTimeout(triggerEvent, nextDelay);
    };

    // Initial delay of 10 seconds before the first event fires
    let timer = setTimeout(triggerEvent, 10000);

    return () => clearTimeout(timer);
  }, []);

  return null; // Invisible component
}
