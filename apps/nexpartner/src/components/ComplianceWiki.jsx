import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Plus, ShieldCheck, Database, History, Lock, ShieldAlert } from 'lucide-react';

const ComplianceWiki = ({ notify }) => {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', classification: 'RESTRICTED' });
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    try {
        const r = await fetch('/api/v1/wiki/articles');
        if (r.ok) {
            const data = await r.json();
            setArticles(Array.isArray(data) ? data : []);
        }
    } catch (e) { setArticles([]); }
  };

  useEffect(() => { load(); }, []);

  const handleCommit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/v1/wiki/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
        setForm({ title: '', content: '', classification: 'RESTRICTED' });
        setShowAdd(false);
        load();
        notify("Regulatory protocol synchronized with global mesh", "success");
    } else { notify("Ledger write rejected", "error"); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-[#0b0f1a] p-10 rounded-[3.5rem] border border-slate-800 shadow-2xl flex justify-between items-center relative overflow-hidden">
        <div className="z-10 flex items-center gap-6">
            <div className="p-4 bg-blue-600/10 rounded-3xl text-blue-500 shadow-inner"><BookOpen size={32}/></div>
            <div>
                <h3 className="text-white font-black uppercase text-xl italic tracking-tighter">Regulatory Compliance Atlas</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase italic tracking-[0.2em]">Secured Ledger of Industrial Handshake Protocols</p>
            </div>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-blue-500 transition-all shadow-xl z-10 flex items-center gap-2">
            <Plus size={14}/> {showAdd ? 'Abort Entry' : 'Declare New Protocol'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCommit} className="bg-[#0b0f1a] p-12 rounded-[4rem] border-2 border-dashed border-blue-600/30 animate-in slide-in-from-top-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-8 text-blue-500 font-black uppercase text-xs italic"><ShieldAlert size={16}/> Protocol Initialization Phase</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Protocol Identifier</label>
                <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="e.g. NIST-800-REV5 / DPA-2026" className="w-full bg-black/40 border border-slate-800 p-6 rounded-2xl text-xs text-white outline-none italic focus:border-blue-600" required />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Security Clearance</label>
                <select value={form.classification} onChange={e=>setForm({...form, classification:e.target.value})} className="w-full bg-black/40 border border-slate-800 p-6 rounded-2xl text-[10px] text-white outline-none font-black uppercase tracking-widest focus:border-blue-600">
                    <option value="PUBLIC">Domain: Public Access</option>
                    <option value="RESTRICTED">Domain: Restricted Internal</option>
                    <option value="TOP_SECRET">Domain: Top Secret Clearance</option>
                </select>
            </div>
          </div>
          <div className="space-y-2 mb-8">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Technical Specification (HTML Allowed)</label>
              <textarea value={form.content} onChange={e=>setForm({...form, content:e.target.value})} placeholder="Insert regulatory requirements here. Rich text rendering is actively supported by the central node..." className="w-full bg-black/40 border border-slate-800 p-6 rounded-2xl text-xs text-white h-48 outline-none italic focus:border-blue-600" required />
          </div>
          <button className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all">Synchronize with Global Ledger</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.length === 0 ? <p className="text-slate-500 italic p-10 text-center col-span-2">Establishing connection to database node...</p> : articles.map(a => (
          <div key={a.id} className="bg-[#0b0f1a] p-12 rounded-[4rem] border border-slate-800 group hover:border-blue-600/50 transition-all shadow-2xl relative flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-900 rounded-lg text-blue-500"><Lock size={16}/></div>
                        <h4 className="text-white font-black uppercase text-sm italic tracking-tighter">{a.title}</h4>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border ${a.classification === 'TOP_SECRET' ? 'text-red-500 border-red-500/20 bg-red-500/5' : a.classification === 'RESTRICTED' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-green-500 border-green-500/20 bg-green-500/5'}`}>{a.classification || 'UNCLASSIFIED'}</span>
                </div>
                
                <div className="bg-black/20 p-6 rounded-3xl border border-slate-900/50 mb-8">
                    <div className="text-slate-400 text-[11px] leading-relaxed italic font-sans" dangerouslySetInnerHTML={{ __html: a.content }} />
                </div>
            </div>

            <div className="pt-6 border-t border-slate-900/50 flex justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-widest italic">
                <div className="flex items-center gap-2"><Database size={12}/> Repository ID: {a.id}</div>
                <div className="flex items-center gap-2 text-slate-500"><History size={12}/> v{a.version || '1.0.0'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ComplianceWiki;
