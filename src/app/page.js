'use client';
import { useState, useEffect } from 'react';
import ClientTime from '../components/ClientTime';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState('online');

  const [stats, setStats] = useState({
    totalRecoveries: 0,
    uptime: '99.99%',
    avgResponseTime: '0.8s'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => prev === 'online' ? 'monitoring' : 'online');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendError = async () => {
    if (!errorMessage.trim()) return;

    setIsLoading(true);
    setStatusMessage('Sending error to AI agent...');

    try {
      const response = await fetch('/api/simulate-crash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errorMessage, service: 'frontend-node-01' })
      });
      const data = await response.json();

      if (response.ok) {
        setStatusMessage('Error sent successfully');
        setStats(prev => ({ ...prev, totalRecoveries: prev.totalRecoveries + 1 }));
        if (data.logs) {
          const newLogs = data.logs.map(log => ({
            message: log.split('] ')[1] || log,
            time: new Date().toLocaleTimeString(),
            type: log.includes('✅') ? 'success' : log.includes('🚨') ? 'error' : 'info'
          }));
          setLogs(prev => [...newLogs.slice(0, 5), ...prev].slice(0, 10));
        }
      } else {
        setStatusMessage('Failed to send error');
      }

      setErrorMessage('');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setStatusMessage('Connection failed');
      setTimeout(() => setStatusMessage(''), 3000);
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateCrash = async () => {
    setIsLoading(true);
    setStatusMessage('Simulating production crash...');

    try {
      const response = await fetch('/api/simulate-crash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'SyntaxError: Unexpected token \';\'  at /pages/api/users.js:23',
          service: 'vercel-production',
          deployment_id: 'dpl_' + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setStatusMessage('Recovery initiated.');
        setStats(prev => ({ ...prev, totalRecoveries: prev.totalRecoveries + 1 }));
        const data = await response.json();
        if (data.logs) {
          const newLogs = data.logs.map(log => ({
            message: log.split('] ')[1] || log,
            time: new Date().toLocaleTimeString(),
            type: log.includes('✅') ? 'success' : log.includes('🚨') ? 'error' : 'info'
          }));
          setLogs(prev => [...newLogs.slice(0, 5), ...prev].slice(0, 10));
        }
      } else {
        setStatusMessage('Simulation failed');
      }

      setTimeout(() => setStatusMessage(''), 5000);
    } catch (error) {
      setStatusMessage('Connection failed');
      setTimeout(() => setStatusMessage(''), 3000);
      console.error('Crash simulation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <header className="mb-12 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative w-10 h-10 bg-[#0F172A] border border-white/10 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="w-4 h-4 text-blue-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                RecoverAI <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">BETA</span>
              </h1>
              <p className="text-slate-400 text-sm">Autonomous Deployment Sentinel</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full ${systemStatus === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400'} transition-all duration-500`}></div>
              <span className="text-xs font-medium text-slate-300">
                {systemStatus === 'online' ? 'System Operational' : 'Monitoring Network'}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Server Time</p>
              <p className="text-sm font-mono text-slate-300"><ClientTime /></p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[ 
            { label: 'System Status', value: 'Active', sub: 'Monitoring 12 services', color: 'emerald', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            )},
            { label: 'Total Recoveries', value: stats.totalRecoveries, sub: 'Autonomous fixes', color: 'blue', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            )},
            { label: 'Uptime', value: stats.uptime, sub: 'Last 30 days', color: 'indigo', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            )},
            { label: 'Avg Response', value: stats.avgResponseTime, sub: 'Detection speed', color: 'purple', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            )}
          ].map((stat, i) => (
            <div key={i} className={`glass-panel p-5 rounded-xl animate-fade-in delay-${(i+1)*100} group hover:bg-white/[0.03] transition-all duration-300`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {stat.icon}
                  </svg>
                </div>
                {i === 0 && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{stat.label}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-xs text-slate-500 truncate">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Panel */}
        <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in delay-400 shadow-2xl shadow-black/40">
          
          {/* Panel Header */}
          <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500/50"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500/50"></div>
              <div className="h-2 w-2 rounded-full bg-green-500/50"></div>
              <span className="ml-2 text-sm font-medium text-slate-300">Control Center</span>
            </div>
            <div className="text-xs font-mono text-slate-500">v1.0.2-stable</div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Left Column: Controls */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Input Area */}
                <div className="bg-[#0F172A]/50 rounded-xl p-1 border border-white/5">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-[#0F172A] text-slate-200 px-5 py-4 rounded-lg border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600 font-mono text-sm"
                      placeholder="Describe the system error (e.g., 'DB Connection Timeout')..."
                      value={errorMessage}
                      onChange={(e) => setErrorMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendError()}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <span className="text-[10px] text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">RETURN</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleSendError}
                    disabled={isLoading || !errorMessage.trim()}
                    className="relative group overflow-hidden rounded-xl bg-blue-600 p-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative bg-[#0F172A] hover:bg-blue-600/10 h-full rounded-[10px] px-6 py-4 transition-all group-hover:bg-[#0F172A]/80">
                      <div className="flex items-center justify-center gap-3">
                        {isLoading ? (
                           <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                        ) : (
                          <svg className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                        <span className="font-semibold text-blue-100 group-hover:text-white">Inject Error</span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleSimulateCrash}
                    disabled={isLoading}
                    className="relative group overflow-hidden rounded-xl bg-gradient-to-tr from-rose-600 to-orange-600 p-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity"></div>
                    <div className="relative bg-gradient-to-tr from-rose-600 to-orange-600 h-full rounded-[10px] px-6 py-4 flex items-center justify-center gap-3 group-active:scale-[0.98] transition-transform">
                       <svg className="w-4 h-4 text-white" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                       </svg>
                       <span className="font-bold text-white tracking-wide">SIMULATE CRASH</span>
                    </div>
                  </button>
                </div>

                {/* Active Services List */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Live Services</h4>
                  {[ 
                    { name: 'Kestra Workflow Engine', status: 'Running', color: 'emerald' },
                    { name: 'Groq AI Analysis', status: 'Connected', color: 'blue' },
                    { name: 'Auto-Recovery Agent', status: 'Standby', color: 'purple' }
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${service.color}-400 shadow-[0_0_8px_rgba(var(--${service.color}-500),0.5)]`}></div>
                        <span className="text-sm text-slate-300">{service.name}</span>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full bg-${service.color}-500/10 text-${service.color}-400 border border-${service.color}-500/20`}>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Terminal/Logs */}
              <div className="lg:col-span-5 flex flex-col h-full min-h-[400px]">
                <div className="flex-1 bg-[#090E1A] rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-inner">
                  <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <svg className="w-3 h-3" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" /></svg>
                      SYSTEM_LOGS
                    </span>
                    <div className="flex gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                       <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-sm space-y-3">
                    {logs.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 opacity-50">
                        <svg className="w-8 h-8" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <span className="text-xs">Awaiting events...</span>
                      </div>
                    ) : (
                      logs.map((log, i) => (
                        <div key={i} className={`animate-fade-in text-xs leading-relaxed break-all ${ 
                          log.type === 'error' ? 'text-rose-400' : 
                          log.type === 'success' ? 'text-emerald-400' : 'text-blue-300'
                        }`}> 
                          <span className="opacity-30 mr-2">[{log.time}]</span>
                          {log.message}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {statusMessage && (
                    <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 text-[10px] text-slate-400 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                       {statusMessage}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center border-t border-white/5 pt-8 pb-4">
           <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs text-slate-600">
             <span>&copy; 2024 RecoverAI Platform</span>
             <span className="hidden md:inline text-slate-800">•</span>
             <span className="flex items-center gap-1">
               Powered by 
               <span className="text-slate-500 font-medium">Groq LLaMA 3</span> 
               & 
               <span className="text-slate-500 font-medium">Kestra</span>
             </span>
           </div>
        </footer>

      </div>
    </div>
  );
}
