import React, { useState } from 'react';
import { ShieldCheck, Key, RefreshCcw, ArrowLeft } from 'lucide-react';

const IdentityReset = ({ token, onBack, notify }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinalize = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch('/api/v1/recovery/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, access_key: key })
        });
        if (res.ok) {
            notify("Identity Access Key synchronized successfully", "success");
            setTimeout(onBack, 2000);
        } else { notify("Handshake Finalization Rejected", "error"); }
    } catch (e) { notify("Mesh communication failure", "error"); }
    setLoading(false);
  };

  return (
    <div className="bg-[#0b0f1a] p-12 rounded-[4rem] border border-slate-800 w-full max-w-md shadow-2xl text-center border-t-4 border-t-blue-600 animate-in zoom-in-95">
      <ShieldCheck className="text-blue-600 mx-auto mb-6" size={64} fill="currentColor"/>
      <h2 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter italic">Establish <span className="text-blue-500 font-light italic">Access Key</span></h2>
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-10 italic">Finalizing identity handshake for token: {token.substring(0,8)}...</p>
      
      <form onSubmit={handleFinalize} className="space-y-6">
        <div className="relative group">
            <Key className="absolute left-5 top-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18}/>
            <input 
                type="password" value={key} onChange={e=>setKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-blue-600 transition-all text-sm italic" 
                placeholder="New Access Key" required 
            />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase shadow-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
            {loading ? <RefreshCcw className="animate-spin" size={20}/> : <Key size={20}/>} Synchronize Mesh
        </button>
      </form>
    </div>
  );
};
export default IdentityReset;
