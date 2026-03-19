import React, { useState, useEffect } from 'react';
import { ShieldAlert, Database, FileText } from 'lucide-react';
const AdminConsole = ({ notify }) => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    fetch('/api/v1/system/admin/audit-logs').then(r => r.json()).then(d => setLogs(d.logs || []));
  }, []);
  return (
    <div className="max-w-4xl bg-[#0b0f1a] p-10 rounded-[3rem] border border-red-900/30 shadow-2xl italic space-y-6 animate-in fade-in">
      <div className="flex items-center gap-4 text-red-500 mb-6"><ShieldAlert size={32}/><h2 className="text-2xl font-black uppercase">Privileged System Audit</h2></div>
      <div className="bg-black/50 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-400 space-y-2">
        {logs.map((l, i) => <p key={i}>> {l}</p>)}
      </div>
      <button onClick={() => window.open('/api/v1/system/logs/raw')} className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-2 hover:underline"><FileText size={14}/> View Raw Trace Stream</button>
    </div>
  );
};
export default AdminConsole;
