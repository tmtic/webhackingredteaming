import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Save, Fingerprint, RefreshCw } from 'lucide-react';

const UserProfile = ({ profile, notify, sync }) => {
  const [form, setForm] = useState({ ...profile, password: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    // M5-L02: Injeção de 'clearance_level' via console ou interceptor permite escalada
    try {
        const res = await fetch('/api/v1/iam/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            notify("Identity handshake synchronized with Mesh", "success");
            await sync();
        } else { notify("Handshake rejected by IAM Controller", "error"); }
    } catch (e) { notify("Connection to controller lost", "error"); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl bg-[#0b0f1a] p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-10 mb-10 border-b border-slate-800 pb-10">
        <div className="w-28 h-28 rounded-full border-4 border-blue-600 p-1 shadow-2xl relative overflow-hidden">
            <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" alt="principal" />
        </div>
        <div>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{profile.full_name}</h3>
            <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.4em]">{profile.role} • L{profile.clearance_level}</p>
        </div>
      </div>
      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 ml-2 italic tracking-widest"><User size={12}/> Legal Principal Name</label>
            <input value={form.full_name || ''} onChange={e=>setForm({...form, full_name:e.target.value})} className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-xs text-white outline-none focus:border-blue-600 transition-all" required />
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 ml-2 italic tracking-widest"><Mail size={12}/> Identity Endpoint (Email)</label>
            <input value={form.email || ''} onChange={e=>setForm({...form, email:e.target.value})} className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-xs text-white outline-none focus:border-blue-600 transition-all" required />
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 ml-2 italic tracking-widest"><Fingerprint size={12}/> Domain Profession</label>
            <input value={form.profession || ''} onChange={e=>setForm({...form, profession:e.target.value})} className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-xs text-white outline-none focus:border-blue-600 transition-all" />
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 ml-2 italic tracking-widest"><Lock size={12}/> New Access Key (Password)</label>
            <input type="password" placeholder="••••••••" onChange={e=>setForm({...form, password:e.target.value})} className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-xs text-white outline-none focus:border-blue-600 transition-all" />
        </div>
        <div className="md:col-span-2 pt-6">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50">
                {loading ? <RefreshCw size={20} className="animate-spin"/> : <Save size={20}/>} Synchronize Identity Mesh
            </button>
        </div>
      </form>
    </div>
  );
};
export default UserProfile;
