import React, { useState } from 'react';
import { Globe, Link2, Zap, ShieldAlert, Cpu } from 'lucide-react';

const GlobalConnect = ({ notify }) => {
  const [response, setResponse] = useState(null);
  const endpoints = [
    { label: 'Identity Auth Node', url: 'http://helix:3000' },
    { label: 'Internal Shared Cache', url: 'http://shared-cache:6379' },
    { label: 'Edge Storage Gateway', url: 'http://shared-db:5432' }
  ];

  const handleTest = async (target) => {
    // M5-L17: SSRF via endpoint validation 
    const res = await fetch('/api/v1/network/edge/handshake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: target })
    });
    const data = await res.json();
    setResponse({ target, data });
    notify("External node handshake complete", "info");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-700">
      <div className="bg-[#0b0f1a] p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
        <h3 className="text-white font-black uppercase text-sm mb-8 flex items-center gap-3"><Globe className="text-blue-500" size={20}/> Partner Connectivity Handshake</h3>
        <div className="grid gap-4">
            {endpoints.map((e, idx) => (
                <button key={idx} onClick={() => handleTest(e.url)} className="w-full bg-black/40 border border-slate-800 p-6 rounded-3xl text-left hover:border-blue-600 transition-all group flex justify-between items-center">
                    <div><p className="text-white font-bold text-xs uppercase italic">{e.label}</p><p className="text-[9px] text-slate-500 font-mono mt-1">{e.url}</p></div>
                    <Link2 size={18} className="text-slate-700 group-hover:text-blue-500"/>
                </button>
            ))}
        </div>
      </div>
      <div className="bg-black/80 p-10 rounded-[4rem] border border-slate-900 font-mono text-[10px] text-green-500 overflow-y-auto shadow-inner min-h-[400px]">
        {response ? (
            <div className="animate-in fade-in"><p className="text-blue-500 mb-4 font-black uppercase tracking-widest">[Handshake Result for {response.target}]</p><pre>{JSON.stringify(response.data, null, 2)}</pre></div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20"><Zap size={48} className="mb-4"/><p className="font-black uppercase tracking-widest">Awaiting industrial node handshake...</p></div>
        )}
      </div>
    </div>
  );
};
export default GlobalConnect;
