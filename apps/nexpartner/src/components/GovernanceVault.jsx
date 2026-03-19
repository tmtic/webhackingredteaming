import React, { useState } from 'react';
import { Search, FileText, Download, ShieldAlert, CheckCircle } from 'lucide-react';

const GovernanceVault = ({ data = [], notify }) => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState(data);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    const r = await fetch(`/api/v1/vault/artifacts/search?query=${query}`);
    if (r.ok) setItems(await r.json());
    setSearching(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <form onSubmit={handleSearch} className="bg-[#0b0f1a] p-8 rounded-[3.5rem] border border-slate-800 flex gap-4 shadow-2xl border-b-4 border-b-blue-600/20">
        <div className="flex-1 bg-black/40 border border-slate-800 rounded-3xl flex items-center px-8 focus-within:border-blue-500 transition-all group">
          <Search size={20} className="text-slate-500 group-focus-within:text-blue-500" />
          <input className="w-full bg-transparent p-6 text-xs text-white outline-none italic font-sans" placeholder="Query industrial artifacts..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-12 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg">
            {searching ? "Indexing..." : "Query Vault"}
        </button>
      </form>
      <div className="grid gap-4">
        {(items && items.length > 0) ? items.map(i => (
          <div key={i.id} className="bg-[#0b0f1a] p-8 rounded-[2.5rem] border border-slate-800 flex justify-between items-center group hover:border-blue-600 transition-all">
            <div className="flex items-center gap-6"><div className="p-4 bg-slate-900 rounded-2xl text-purple-500 shadow-inner"><FileText size={28}/></div><div><p className="text-white font-black text-sm uppercase tracking-tighter">{i.title}</p><p className="text-[10px] text-slate-500 font-bold uppercase mt-1 italic tracking-widest">Clearance: {i.classification}</p></div></div>
            <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500/40" />
                {/* SRE FIX: Download button active triggering Path Traversal logic */}
                <button onClick={() => window.location.href=`/api/v1/vault/artifacts/download?file=${i.title.replace(/\s+/g, '_')}.pdf`} className="p-4 bg-slate-900 text-slate-400 rounded-2xl hover:text-white hover:bg-blue-600 transition-all">
                    <Download size={22}/>
                </button>
            </div>
          </div>
        )) : (
            <div className="p-32 text-center border-4 border-dashed border-slate-900 rounded-[5rem]">
                <ShieldAlert size={64} className="text-slate-800 mx-auto mb-6 opacity-20"/>
                <p className="text-slate-700 font-black uppercase text-sm tracking-[0.4em]">No artifacts synchronized in current mesh</p>
            </div>
        )}
      </div>
    </div>
  );
};
export default GovernanceVault;
