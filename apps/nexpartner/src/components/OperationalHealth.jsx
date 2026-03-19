import React, { useState } from 'react';
import { Activity, ShieldAlert } from 'lucide-react';

const OperationalHealth = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDiagnostics = async () => {
    try {
      const res = await fetch('/api/v1/system/diagnostics/core');
      const json = await res.json();
      if (res.ok) {
        setData(json);
        setError(null);
      } else {
        setError(json.error);
        setData(null);
      }
    } catch (e) { setError("Network error"); }
  };

  return (
    <div className="animate-fade-in text-slate-200 mt-4 h-full">
       <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-lg max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-emerald-500" />
            <h2 className="text-2xl font-bold text-white tracking-tight">System Health & Diagnostics</h2>
          </div>
          
          <p className="mb-8 text-slate-400 leading-relaxed">
            Access to the core mesh diagnostics is strictly restricted to Level 10 Global Administrators. 
            Unauthorized attempts are logged in the sovereign ledger.
          </p>

          <button 
            onClick={fetchDiagnostics} 
            className="bg-red-500/10 text-red-400 border border-red-500/30 px-6 py-3 rounded-lg font-bold hover:bg-red-500/20 transition-all flex items-center gap-3 shadow-lg shadow-red-500/5"
          >
            <ShieldAlert className="w-5 h-5" /> Execute Core Diagnostics
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-500/30 flex items-center gap-3 font-medium">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          {data && (
            <div className="mt-6 p-6 bg-emerald-900/20 text-emerald-400 rounded-lg border border-emerald-500/30">
               <p className="font-bold text-lg mb-2 flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-emerald-500" /> {data.message}
               </p>
               <div className="bg-slate-900/50 p-4 rounded border border-emerald-500/20 mt-4">
                 <pre className="font-mono text-sm text-emerald-300/80 whitespace-pre-wrap">
                   {JSON.stringify(data.system_data, null, 2)}
                 </pre>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};

export default OperationalHealth;
