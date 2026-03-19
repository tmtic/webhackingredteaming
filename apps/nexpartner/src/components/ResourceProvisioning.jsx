import React, { useState } from 'react';
import { UploadCloud, FileCode, Play, Terminal } from 'lucide-react';

const ResourceProvisioning = ({ notify }) => {
  const [xml, setXml] = useState('<?xml version="1.0" encoding="UTF-8"?>\n<provision>\n  <node>INDUSTRIAL-ALPHA-2026</node>\n  <status>ACTIVE</status>\n</provision>');
  const [output, setOutput] = useState(null);

  const handleSync = async () => {
    // M3-L05: XXE - Parser configurado para aceitar entidades externas
    const res = await fetch('/api/v1/provision/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xml })
    });
    const data = await res.json();
    setOutput(data);
    if (res.ok) notify("Policy Mesh Synchronized", "success");
    else notify("Parser Validation Error", "error");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="bg-[#0b0f1a] p-8 rounded-[3rem] border border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-black uppercase text-xs flex items-center gap-2"><FileCode size={16} className="text-blue-500"/> Policy Definition</h3>
            <button onClick={handleSync} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black uppercase text-[10px] hover:bg-blue-500 transition-all flex items-center gap-2"><Play size={12}/> Execute Sync</button>
        </div>
        <textarea value={xml} onChange={(e) => setXml(e.target.value)} className="w-full bg-black/40 border border-slate-800 p-6 rounded-2xl text-blue-400 font-mono text-xs h-96 outline-none focus:border-blue-500 transition-all" />
      </div>
      <div className="bg-[#0b0f1a] p-8 rounded-[3rem] border border-slate-800 shadow-xl flex flex-col">
        <h3 className="text-white font-black uppercase text-xs mb-6 flex items-center gap-2"><Terminal size={16} className="text-slate-500"/> Provisioning Output</h3>
        <div className="flex-1 bg-black p-6 rounded-2xl font-mono text-[10px] text-green-500 overflow-y-auto">
            {output ? <pre>{JSON.stringify(output, null, 2)}</pre> : "> Ready for industrial node handshake..."}
        </div>
      </div>
    </div>
  );
};
export default ResourceProvisioning;
