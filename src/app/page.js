'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState('online');

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => prev === 'online' ? 'monitoring' : 'online');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendError = async () => {
    if (!errorMessage.trim()) return;
    
    setIsLoading(true);
    setStatusMessage('🚀 Sending error to AI agent...');
    
    try {
      const response = await fetch('/api/simulate-crash', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errorMessage, service: 'frontend-node-01' })
      });
      const data = await response.json();
      
      if (response.ok) {
        setStatusMessage('✅ Error sent successfully!');
        if (data.logs) {
          const newLogs = data.logs.map(log => ({
            message: log.split('] ')[1] || log,
            time: new Date().toLocaleTimeString(),
            type: log.includes('✅') ? 'success' : log.includes('🚨') ? 'error' : 'info'
          }));
          setLogs(prev => [...newLogs.slice(0, 5), ...prev].slice(0, 10));
        }
      } else {
        setStatusMessage('❌ Failed to send error');
      }
      
      setErrorMessage('');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setStatusMessage('❌ Connection failed');
      setTimeout(() => setStatusMessage(''), 3000);
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateCrash = async () => {
    setIsLoading(true);
    setStatusMessage('💥 Simulating production crash...');
    
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
        setStatusMessage('✅ Crash simulated! Check Kestra for auto-recovery...');
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
        setStatusMessage('❌ Crash simulation failed');
      }
      
      setTimeout(() => setStatusMessage(''), 5000);
    } catch (error) {
      setStatusMessage('❌ Connection failed');
      setTimeout(() => setStatusMessage(''), 3000);
      console.error('Crash simulation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with status indicator */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
              systemStatus === 'online' ? 'bg-green-400' : 'bg-blue-400'
            }`}></div>
            <span className="text-sm text-gray-300 uppercase tracking-wider">
              System {systemStatus}
            </span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Autonomous Deployment Agent
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            AI-Powered Error Recovery & Auto-Healing System for Production Environments
          </p>
        </div>

        {/* Status bar */}
        <div className="mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-gray-300">Kestra Engine</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-gray-300">AI Analysis</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-gray-300">Auto-Recovery</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Last check: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">⚡</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Control Center</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Error Input Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 text-sm">!</span>
                  Error Injection
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Describe the error or issue..." 
                      className="w-full bg-black/30 text-white p-4 rounded-xl border border-gray-600/50 placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      value={errorMessage}
                      onChange={(e) => setErrorMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendError()}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-500 text-sm">{errorMessage.length}/500</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={handleSendError} 
                      disabled={isLoading || !errorMessage.trim()}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 font-semibold shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        '🚨 Send to AI Agent'
                      )}
                    </button>
                    
                    <button 
                      onClick={handleSimulateCrash} 
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 font-semibold shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Simulating...
                        </div>
                      ) : (
                        '💥 Simulate Production Crash'
                      )}
                    </button>
                  </div>
                  
                  {statusMessage && (
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${
                      statusMessage.includes('✅') 
                        ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                        : statusMessage.includes('❌') 
                        ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    }`}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse mr-3"></div>
                        {statusMessage}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Log Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">📊</span>
                  Activity Monitor
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {logs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">📡</div>
                      <p>Waiting for system events...</p>
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="bg-black/30 rounded-lg p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              log.type === 'success' ? 'text-green-300' : 
                              log.type === 'error' ? 'text-red-300' : 'text-blue-300'
                            }`}>
                              {log.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">{log.time}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ml-3 mt-2 ${
                            log.type === 'success' ? 'bg-green-400' : 
                            log.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                          }`}></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔍', title: 'Error Detection', desc: 'Real-time monitoring and intelligent alert processing', color: 'from-red-500 to-pink-500' },
            { icon: '🧠', title: 'AI Analysis', desc: 'Advanced error classification using machine learning', color: 'from-blue-500 to-cyan-500' },
            { icon: '⚡', title: 'Auto-Healing', desc: 'Automated infrastructure and code remediation', color: 'from-green-500 to-emerald-500' },
            { icon: '📈', title: 'Recovery', desc: 'Complete system restoration and performance monitoring', color: 'from-purple-500 to-indigo-500' }
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-sm rounded-full border border-gray-700/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-gray-300 text-sm">System operational • Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}