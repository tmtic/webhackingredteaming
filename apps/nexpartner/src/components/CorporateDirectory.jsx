import React, { useState, useEffect } from 'react';
import { Search, Download, Building, Users, MapPin } from 'lucide-react';

const CorporateDirectory = ({ notify }) => {
  const [directory, setDirectory] = useState([]);
  
  const load = async () => {
    const r = await fetch('/api/v1/iam/team');
    if (r.ok) setDirectory(await r.json());
  };
  
  useEffect(() => { load(); }, []);

  const handleExport = async (e) => {
    // FIX: preventDefault impede que a página de um "refresh" (Reload) e deslogue o usuário
    e.preventDefault();
    const r = await fetch('/api/v1/iam/export');
    if (r.ok) {
        const blob = await r.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'entity_registry.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        notify("Entity Registry exported to Local Storage", "success");
    } else { notify("Export rejected by IAM Controller", "error"); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#0b0f1a] p-10 rounded-[3rem] border border-slate-800 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4"><Building className="text-blue-500" size={24}/><div><h3 className="text-white font-black uppercase text-sm italic">Corporate Atlas</h3><p className="text-slate-500 text-[10px] font-bold uppercase italic tracking-widest">Global Entity Synchronization</p></div></div>
        <button onClick={handleExport} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg"><Download size={14}/> Export Entity Registry</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {directory.map(u => (
          <div key={u.id} className="bg-[#0b0f1a] p-8 rounded-[3rem] border border-slate-800 group hover:border-blue-600/50 transition-all shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full border-2 border-blue-600 p-0.5"><img src={`https://i.pravatar.cc/150?u=${u.id}`} className="w-full h-full rounded-full" /></div>
                <div><h4 className="text-white font-black uppercase text-xs italic">{u.full_name || u.username}</h4><p className="text-slate-500 text-[9px] uppercase tracking-widest">{u.role}</p></div>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-900">
                <p className="text-[10px] text-slate-400 flex items-center gap-2"><MapPin size={12} className="text-blue-500"/> Node Alpha Sector</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-2"><Users size={12} className="text-blue-500"/> Clearance: L{u.clearance_level || 5}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CorporateDirectory;
