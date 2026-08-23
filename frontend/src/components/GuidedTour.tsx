'use client';
import { useEffect, useState } from 'react';
import { Joyride, EventData, STATUS, Step } from 'react-joyride';

export default function GuidedTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if the user has already completed the tour
    const hasCompleted = localStorage.getItem('riq_tour_completed');
    if (!hasCompleted) {
      // Small delay to ensure UI is rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom event to restart tour manually
  useEffect(() => {
    const handleRestart = () => {
      setRun(true);
      localStorage.removeItem('riq_tour_completed');
    };
    window.addEventListener('riq:restart_tour', handleRestart);
    return () => window.removeEventListener('riq:restart_tour', handleRestart);
  }, []);

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('riq_tour_completed', 'true');
    }
  };

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to ReportIQ! 🚀',
      content: "Let's take a quick tour of your new AI-powered agency dashboard. We'll show you how to automate your reporting and monitor client performance.",
      skipBeacon: true,
    },
    {
      target: '.tour-sidebar-nav',
      title: 'Navigation Hub',
      content: 'Here is where you access all your Clients, Reports, and System Settings. Everything is just a click away.',
      placement: 'right',
    },
    {
      target: '.tour-dashboard-stats',
      title: 'Global Metrics',
      content: 'At a glance, see how many clients you manage, reports generated, and most importantly: the total hours of manual work saved by ReportIQ.',
      placement: 'bottom',
    },
    {
      target: '.tour-anomaly-radar',
      title: 'AI Anomaly Radar',
      content: 'This is the crown jewel. Our AI actively monitors all your connected data sources (GA4, Meta, etc.) and alerts you instantly if traffic drops or conversions spike.',
      placement: 'top',
    },
    {
      target: '.tour-quick-actions',
      title: 'Quick Actions',
      content: 'Ready to get started? Use these buttons to instantly onboard a new client or generate your first AI report.',
      placement: 'bottom',
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleJoyrideCallback}
      options={{
        showProgress: true,
        primaryColor: 'var(--accent)',
        textColor: '#ffffff',
        backgroundColor: '#1a1a1a',
        arrowColor: '#1a1a1a',
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 10000,
      }}
      styles={{
        tooltip: {
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(145deg, #1f1f1f, #141414)',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipTitle: {
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '12px',
          color: '#ffffff',
          fontFamily: 'inherit',
        },
        tooltipContent: {
          fontSize: '14px',
          color: '#a3a3a3',
          lineHeight: 1.6,
          padding: '0',
          fontFamily: 'inherit',
        },
        buttonPrimary: {
          background: 'linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: 600,
          outline: 'none',
        },
        buttonBack: {
          color: '#a3a3a3',
          marginRight: '12px',
          fontSize: '14px',
          fontWeight: 500,
        },
        buttonSkip: {
          color: '#737373',
          fontSize: '13px',
        }
      }}
    />
  );
}
