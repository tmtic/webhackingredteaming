import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Layout, Users, FileText, CreditCard, ShoppingBag, BellRing, UploadCloud, Activity, Search, Globe, LogOut, ChevronRight, Bell, Database, ClipboardCheck, UserCircle } from 'lucide-react';

import Dashboard from './components/Dashboard';
import IAMIdentity from './components/IAMIdentity';
import GovernanceVault from './components/GovernanceVault';
import UserProfile from './components/UserProfile';
import PartnerSupport from './components/PartnerSupport';
import SubscriptionLedger from './components/SubscriptionLedger';
import Marketplace from './components/Marketplace';
import ResourceProvisioning from './components/ResourceProvisioning';
import OperationalHealth from './components/OperationalHealth';
import GlobalConnect from './components/GlobalConnect';
import CorporateDirectory from './components/CorporateDirectory';
import IdentityRecovery from './components/IdentityRecovery';
import IdentityReset from './components/IdentityReset';
import ComplianceWiki from './components/ComplianceWiki';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); 
  const [resetToken, setResetToken] = useState(null);
  const [notif, setNotif] = useState(null);
  const [state, setState] = useState({ metrics: {nodes:48, items:0, alerts:0, balance:0}, profile: {}, audit: [], vault: [] });

  const notify = (msg, type = 'info') => { setNotif({ msg, type }); setTimeout(() => setNotif(null), 4000); };

  // SPA Query String Capture (Bypass de Nginx 404)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('recovery_token');
    if (token) {
        setResetToken(token);
        setAuthMode('reset');
    }
  }, []);

  useEffect(() => {
    const verifySession = async () => {
        try {
            const res = await fetch("/api/v1/auth/session/verify");
            if (res.ok) { const data = await res.json(); setUser(data.user); }
        } catch (e) { console.error("Handshake validation failed"); }
    };
    if (!user) verifySession();
  }, []);
  const sync = useCallback(async () => {
    if (!user) return;
    try {
        const [mRes, vRes, pRes, aRes] = await Promise.all([
            fetch('/api/v1/system/metrics'), fetch('/api/v1/vault/artifacts'), fetch('/api/v1/iam/profile'), fetch('/api/v1/system/audit/stream')
        ]);
        if (mRes.ok && vRes.ok && pRes.ok && aRes.ok) {
            const vaultData = await vRes.json();
            const auditData = await aRes.json();
            // SRE FIX: Array validation to prevent React .map() crashes
            setState({ 
                metrics: await mRes.json(), 
                vault: Array.isArray(vaultData) ? vaultData : [], 
                profile: await pRes.json(), 
                audit: Array.isArray(auditData) ? auditData : [] 
            });
        }
    } catch (e) { console.error("Mesh Sync failure"); }
  }, [user]);

  useEffect(() => { if (user) sync(); }, [user, view, sync]);

  if (!user) return (
    <div className="min-h-screen bg-[#060912] flex items-center justify-center p-6 italic font-sans text-slate-300">
      {notif && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-[#0b0f1a] border border-blue-500/50 p-6 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-300">
            <div className={`p-2 rounded-lg ${notif.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}><Bell size={16}/></div>
            <p className="text-[10px] font-black uppercase text-white tracking-widest italic">{notif.msg}</p>
        </div>
      )}
      
      {authMode === 'login' && (
        <div className="bg-[#0b0f1a] p-12 rounded-[4rem] border border-slate-800 w-full max-w-md shadow-2xl text-center border-b-4 border-b-blue-600 animate-in zoom-in-95">
          <Shield className="text-blue-600 mx-auto mb-6" size={64} fill="currentColor"/>
          <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tighter italic">NexPartner <span className="text-blue-500 font-light italic">Sovereign</span></h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch('/api/v1/auth/session/init', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ user: e.target.u.value, pass: e.target.p.value }) });
            if (res.ok) { const d = await res.json(); setUser(d.user); }
            else notify("Security Node Rejection", "error");
          }} className="space-y-4">
            <input name="u" className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all text-sm italic" placeholder="Principal Username / Email" required />
            <input name="p" type="password" className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all text-sm italic" placeholder="Access Key" required />
            <button type="button" onClick={() => setAuthMode('recovery')} className="text-[10px] text-slate-500 hover:text-blue-500 font-black uppercase tracking-widest mb-2 transition-all italic block mx-auto">Forgot Access Key?</button>
            <button className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase shadow-lg shadow-blue-600/10 hover:bg-blue-500 transition-all tracking-widest">Establish Mesh Handshake</button>
          </form>
        </div>
      )}
      {authMode === 'recovery' && <IdentityRecovery onBack={() => setAuthMode('login')} notify={notify} />}
      {authMode === 'reset' && <IdentityReset token={resetToken} onBack={() => { setAuthMode('login'); window.history.replaceState({}, '', '/'); }} notify={notify} />}
    </div>
  );

  const menus = [
    {id:'dashboard', icon:Layout, label:'Control Plane'}, {id:'profile', icon:UserCircle, label:'Identity Settings'},
    {id:'iam', icon:Users, label:'Entity Governance'}, {id:'agreements', icon:FileText, label:'Vault Registry'},
    {id:'billing', icon:CreditCard, label:'Settlement Ledger'}, {id:'market', icon:ShoppingBag, label:'Provisioning Hub'},
    {id:'support', icon:BellRing, label:'Handshake Support'}, {id:'provision', icon:UploadCloud, label:'Policy Sync'},
    {id:'telemetry', icon:Activity, label:'Telemetry Pulse'}, {id:'directory', icon:Search, label:'Corporate Atlas'},
    {id:'edge', icon:Globe, label:'Global Connect'}, {id:'wiki', icon:Database, label:'Compliance Atlas'},
    {id:'audit', icon:ClipboardCheck, label:'Audit Stream'}
  ];

  return (
    <div className="min-h-screen bg-[#060912] text-slate-300 flex font-sans italic overflow-hidden">
      {notif && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-[#0b0f1a] border border-blue-500/50 p-6 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-300">
            <div className={`p-2 rounded-lg ${notif.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}><Bell size={16}/></div>
            <p className="text-[10px] font-black uppercase text-white tracking-widest italic">{notif.msg}</p>
        </div>
      )}
      <aside className="w-72 bg-[#0b0f1a] border-r border-slate-800/50 p-6 flex flex-col gap-2 shadow-2xl z-10 overflow-y-auto custom-scrollbar">
        <div className="text-blue-600 font-black text-xl mb-10 flex items-center gap-2 tracking-tighter uppercase italic"><Shield fill="currentColor"/> NEXPARTNER</div>
        <nav className="flex-1 space-y-1">
          {menus.map(m => (
            <button key={m.id} onClick={() => setView(m.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase transition-all ${view===m.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800/30'}`}>
              <div className="flex items-center gap-3"><m.icon size={18}/> {m.label}</div><ChevronRight size={12} className={view===m.id ? 'opacity-100' : 'opacity-0'}/>
            </button>
          ))}
        </nav>
        <button onClick={async () => { await fetch('/api/v1/auth/session/terminate', { method: 'POST' }); window.location.href = '/'; }} className="text-red-500 text-[10px] font-black uppercase p-4 mt-4 border border-red-500/10 rounded-2xl hover:bg-red-500/10 transition-colors"><LogOut size={16}/> Terminate Mesh Session</button>
      </aside>
      <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-br from-[#060912] to-[#0a0e17] scroll-smooth relative">
        <header className="mb-12 border-b border-slate-800/50 pb-8 flex justify-between items-end">
            <div><h1 className="text-6xl font-black text-white tracking-tighter uppercase mb-2 italic">{view.replace('_', ' ')}</h1><p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Node: INDUSTRIAL_ALPHA_2026</p></div>
            <div className="bg-slate-900 px-6 py-2 border border-slate-800 rounded-full text-blue-500 font-black uppercase text-[10px] tracking-widest italic shadow-inner">Clearance: L{state.profile.clearance_level || 5}</div>
        </header>

        <div className="pb-32">
            {view === 'dashboard' && <Dashboard metrics={state.metrics} />}
            {view === 'profile' && <UserProfile profile={state.profile} notify={notify} sync={sync} />}
            {view === 'iam' && <IAMIdentity profile={state.profile} notify={notify} />}
            {view === 'agreements' && <GovernanceVault data={state.vault} notify={notify} />}
            {view === 'billing' && <SubscriptionLedger wallet={{balance: state.metrics.balance}} notify={notify} sync={sync} />}
            {view === 'market' && <Marketplace notify={notify} sync={sync} />}
            {view === 'support' && <PartnerSupport notify={notify} />}
            {view === 'provision' && <ResourceProvisioning notify={notify} />}
            {view === 'telemetry' && <OperationalHealth notify={notify} />}
            {view === 'directory' && <CorporateDirectory notify={notify} />}
            {view === 'edge' && <GlobalConnect notify={notify} />}
            {view === 'wiki' && <ComplianceWiki notify={notify} />}
            {view === 'audit' && (
                <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {state.audit.map(l => (
                        <div key={l.id} className="bg-[#0b0f1a] p-6 rounded-3xl border border-slate-800 font-mono text-[11px] flex justify-between group hover:border-blue-600/30 transition-all shadow-xl">
                            <div className="flex gap-4"><span className="text-blue-600 font-black uppercase">[{l.event}]</span><span className="text-slate-400 italic">Node {l.node}</span></div>
                            <div className="flex gap-4"><span className="text-slate-500 uppercase">Principal: {l.principal}</span><span className={l.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}>{l.status}</span></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );
};
export default App;
