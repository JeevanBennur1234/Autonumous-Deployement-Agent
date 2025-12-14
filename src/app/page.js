'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState('online');
  const [stats, setStats] = useState({
    totalRecoveries: 0,
    uptime: '99.9%',
    avgResponseTime: '1.2s'
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
        setStatusMessage('Crash simulated successfully. Auto-recovery initiated.');
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
        setStatusMessage('Crash simulation failed');
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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]"></div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  RecoverAI Platform
                </h1>
                <p className="text-sm text-slate-400">Autonomous Deployment Agent</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus === 'online' ? 'bg-emerald-400' : 'bg-blue-400'
                } animate-pulse`}></div>
                <span className="text-sm text-slate-300 font-medium">
                  {systemStatus === 'online' ? 'All Systems Operational' : 'Monitoring Active'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">System Status</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-white">Operational</p>
            <p className="text-xs text-slate-500 mt-1">All services running</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Recoveries</span>
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalRecoveries}</p>
            <p className="text-xs text-slate-500 mt-1">Total automated fixes</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Uptime</span>
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white">{stats.uptime}</p>
            <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Avg Response</span>
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white">{stats.avgResponseTime}</p>
            <p className="text-xs text-slate-500 mt-1">Detection to fix</p>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="border-b border-slate-700/50 bg-slate-800/50 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Control Center</h2>
            <p className="text-sm text-slate-400 mt-1">Monitor and test autonomous error recovery</p>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Error Input Section */}
              <div className="space-y-5">
                <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center mr-3 border border-red-500/20">
                      <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Error Injection</h3>
                      <p className="text-xs text-slate-400">Trigger AI-powered recovery</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Error Description
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g., Database connection timeout, API 500 error..."
                          className="w-full bg-slate-900/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          value={errorMessage}
                          onChange={(e) => setErrorMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendError()}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-slate-500 text-xs">{errorMessage.length}/500</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleSendError}
                        disabled={isLoading || !errorMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white py-3 px-4 rounded-lg transition-all font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Send Error</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleSimulateCrash}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white py-3 px-4 rounded-lg transition-all font-medium shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 disabled:shadow-none flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Running</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Simulate</span>
                          </>
                        )}
                      </button>
                    </div>

                    {statusMessage && (
                      <div className={`p-3 rounded-lg border transition-all duration-300 ${
                        statusMessage.includes('success') || statusMessage.includes('successfully')
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : statusMessage.includes('failed') || statusMessage.includes('Failed')
                          ? 'bg-red-500/10 border-red-500/30 text-red-300'
                          : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                      }`}>
                        <div className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-2"></div>
                          {statusMessage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Status */}
                <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-white mb-3">Active Services</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Kestra Engine', status: 'Running', color: 'emerald' },
                      { name: 'Groq AI Analysis', status: 'Active', color: 'blue' },
                      { name: 'Auto-Recovery', status: 'Enabled', color: 'cyan' }
                    ].map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 bg-${service.color}-400 rounded-full animate-pulse`}></div>
                          <span className="text-sm text-slate-300">{service.name}</span>
                        </div>
                        <span className={`text-xs font-medium text-${service.color}-400`}>{service.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Log Section */}
              <div className="space-y-5">
                <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 overflow-hidden">
                  <div className="border-b border-slate-700/50 bg-slate-900/50 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-base font-semibold text-white">Activity Monitor</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Live Feed</span>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar">
                      {logs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-sm">Waiting for system events</p>
                          <p className="text-xs mt-1">Trigger an error to see activity</p>
                        </div>
                      ) : (
                        logs.map((log, index) => (
                          <div key={index} className="group bg-slate-900/50 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-900/70 transition-all duration-200">
                            <div className="flex items-start space-x-3">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                                log.type === 'success' ? 'bg-emerald-400' :
                                log.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                              } animate-pulse`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-relaxed ${
                                  log.type === 'success' ? 'text-emerald-300' :
                                  log.type === 'error' ? 'text-red-300' : 'text-blue-300'
                                }`}>
                                  {log.message}
                                </p>
                                <p className="text-slate-500 text-xs mt-1 font-mono">{log.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
              title: 'Error Detection',
              desc: 'Real-time monitoring and intelligent alert processing',
              color: 'red'
            },
            {
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
              title: 'AI Analysis',
              desc: 'Advanced error classification using machine learning',
              color: 'blue'
            },
            {
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
              title: 'Auto-Healing',
              desc: 'Automated infrastructure and code remediation',
              color: 'emerald'
            },
            {
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              title: 'Recovery',
              desc: 'Complete system restoration and performance monitoring',
              color: 'cyan'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:bg-slate-800/50">
              <div className={`w-10 h-10 bg-${feature.color}-500/10 rounded-lg flex items-center justify-center text-${feature.color}-400 mb-3 border border-${feature.color}-500/20`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-1.5">{feature.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-slate-500">
              <span>RecoverAI Platform v1.0</span>
              <span className="text-slate-700">|</span>
              <span>Powered by Groq AI & Kestra</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
