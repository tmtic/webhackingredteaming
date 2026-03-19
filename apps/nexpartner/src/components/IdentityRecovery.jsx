import React, { useState } from 'react';
import { Shield, Mail, ArrowLeft, Send, RefreshCw } from 'lucide-react';

const IdentityRecovery = ({ onBack, notify }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHandshake = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch('/api/v1/recovery/handshake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: email })
        });
        if (res.ok) notify("Security token dispatched to identity endpoint", "success");
        else notify("Handshake rejected: Endpoint not recognized", "error");
    } catch (e) { notify("Mail mesh synchronization error", "error"); }
    setLoading(false);
  };

  return (
    <div className="bg-[#0b0f1a] p-12 rounded-[4rem] border border-slate-800 w-full max-w-md shadow-2xl text-center border-b-4 border-b-blue-600 animate-in zoom-in-95">
      <Shield className="text-blue-600 mx-auto mb-6" size={64} fill="currentColor"/>
      <h2 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">Identity <span className="text-blue-500 font-light">Recovery</span></h2>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Establish a new access handshake</p>
      
      <form onSubmit={handleHandshake} className="space-y-4">
        <div className="relative group">
            <Mail className="absolute left-5 top-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18}/>
            <input 
                type="email" value={email} onChange={e=>setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-blue-600 transition-all text-sm" 
                placeholder="Identity Endpoint (Email)" required 
            />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase shadow-lg shadow-blue-600/10 hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="animate-spin" size={18}/> : <Send size={18}/>} Initiate Recovery
        </button>
        <button type="button" onClick={onBack} className="flex items-center gap-2 mx-auto text-[10px] font-black text-slate-500 uppercase hover:text-white transition-all pt-4">
            <ArrowLeft size={14}/> Back to Handshake
        </button>
      </form>
    </div>
  );
};
export default IdentityRecovery;
