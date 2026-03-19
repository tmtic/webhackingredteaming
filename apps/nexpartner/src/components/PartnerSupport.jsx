import React, { useState } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, ShieldAlert } from 'lucide-react';

const PartnerSupport = ({ notify }) => {
  const [tickets, setTickets] = useState([
    { id: 102, subject: 'Latency on node Alpha', status: 'OPEN', date: '2026-03-18' },
    { id: 99, subject: 'Vault Sync Permissions', status: 'CLOSED', date: '2026-03-15' }
  ]);
  const [form, setForm] = useState({ subject: '', body: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    const newT = { id: Math.floor(Math.random()*1000), subject: form.subject, status: 'OPEN', date: new Date().toISOString().split('T')[0] };
    setTickets([newT, ...tickets]);
    notify("Dispatch established", "success");
    setForm({ subject: '', body: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in">
      <div className="bg-[#0b0f1a] p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
        <h3 className="text-white font-black uppercase text-sm mb-8 flex items-center gap-3"><MessageSquare className="text-blue-500"/> Service Dispatch</h3>
        <form onSubmit={handleCreate} className="space-y-6">
          <input value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} placeholder="Subject Line..." className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-xs text-white outline-none focus:border-blue-600" required />
          <textarea value={form.body} onChange={e=>setForm({...form, body:e.target.value})} placeholder="Technical details..." className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-xs text-white h-40 outline-none focus:border-blue-600" required />
          <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] hover:bg-blue-500 transition-all shadow-lg flex items-center gap-2"><Send size={14}/> Execute Dispatch</button>
        </form>
      </div>
      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">Historical Activity</p>
        <div className="grid gap-3">
          {tickets.map(t => (
            <div key={t.id} className="bg-[#0b0f1a] p-6 rounded-2xl border border-slate-800 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${t.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                    {t.status === 'OPEN' ? <Clock size={16}/> : <CheckCircle size={16}/>}
                </div>
                <div><p className="text-white font-bold text-xs">{t.subject}</p><p className="text-[9px] text-slate-500 uppercase">#NEX-{t.id} • {t.date}</p></div>
              </div>
              <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${t.status === 'OPEN' ? 'text-blue-500 border border-blue-500/20' : 'text-slate-600 border border-slate-800'}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PartnerSupport;
