import React, { useState, useEffect } from 'react';
import { Users, Trash2, UserPlus, ShieldCheck, X, Building, RefreshCw } from 'lucide-react';

const IAMIdentity = ({ profile, notify }) => {
  const [team, setTeam] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'Specialist', tenant_id: profile?.tenant_id || 1 });

  const load = async () => {
    setLoading(true);
    try {
        const [tRes, tenRes] = await Promise.all([fetch('/api/v1/iam/team'), fetch('/api/v1/iam/tenants')]);
        if (tRes.ok) { const d = await tRes.json(); setTeam(Array.isArray(d) ? d : []); }
        if (tenRes.ok) { const d = await tenRes.json(); setTenants(Array.isArray(d) ? d : []); }
    } catch(e) { setTeam([]); setTenants([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleProvision = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/v1/iam/member/provision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const data = await res.json();
    if (res.ok) {
        notify(data.message || "Identity provisioned in mesh", "success");
        setShowModal(false);
        load();
    } else { notify(data.error || "Identity mesh conflict", "error"); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-[#0b0f1a] p-10 rounded-[3rem] border border-slate-800 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4"><Users className="text-blue-500" size={24}/><div><h3 className="text-white font-black uppercase text-sm">Entity Governance</h3><p className="text-slate-500 text-[10px] font-bold uppercase italic">Managing node mesh for {profile?.tenant_name || 'System'}</p></div></div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg"><UserPlus size={14}/> Provision Principal</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <form onSubmit={handleProvision} className="bg-[#0b0f1a] p-12 rounded-[4rem] border border-slate-800 w-full max-w-lg shadow-2xl space-y-6 relative border-t-4 border-t-blue-600">
                <button type="button" onClick={()=>setShowModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={20}/></button>
                <div className="text-center mb-4"><h4 className="text-white font-black uppercase text-lg italic tracking-tighter">New Identity Handshake</h4><p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mt-2">Establish authorized node in partner ecosystem</p></div>
                <input placeholder="Principal Username (ID)" className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-xs text-white outline-none focus:border-blue-600" onChange={e=>setNewUser({...newUser, username: e.target.value})} required />
                <input placeholder="Corporate Identity Email" className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-xs text-white outline-none focus:border-blue-600" onChange={e=>setNewUser({...newUser, email: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                    <select className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-[10px] text-white outline-none" value={newUser.tenant_id} onChange={e=>setNewUser({...newUser, tenant_id: parseInt(e.target.value)})}>
                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select className="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-[10px] text-white outline-none" onChange={e=>setNewUser({...newUser, role: e.target.value})}>
                        <option>Specialist</option><option>Lead Auditor</option><option>Node Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 shadow-xl transition-all">Initiate Identity Sync</button>
            </form>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? <div className="p-20 text-center"><RefreshCw className="animate-spin text-blue-500 mx-auto" size={32}/></div> : team.map(u => (
          <div key={u.id} className="bg-black/20 p-6 rounded-3xl border border-slate-800 flex justify-between items-center group hover:border-blue-600/30 transition-all">
            <div className="flex items-center gap-4"><div className="p-3 bg-slate-900 rounded-2xl text-blue-500"><ShieldCheck size={20}/></div><div><p className="text-white font-bold text-sm uppercase italic">{u.full_name || u.username}</p><p className="text-[9px] text-slate-500 uppercase tracking-widest">{u.role} • {u.email}</p></div></div>
            {u.id !== profile?.id && <button onClick={async () => { await fetch(`/api/v1/iam/member/${u.id}`, {method:'DELETE'}); load(); notify("Identity Revoked from Mesh", "success"); }} className="p-4 text-slate-700 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-2xl"><Trash2 size={20}/></button>}
          </div>
        ))}
      </div>
    </div>
  );
};

// SRE FIX: Exportação obrigatória para o motor de compilação
export default IAMIdentity;
