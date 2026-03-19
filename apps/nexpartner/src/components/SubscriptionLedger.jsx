import React, { useState, useEffect } from 'react';
import { CreditCard, FileText, Activity } from 'lucide-react';

const SubscriptionLedger = () => {
  const [ledger, setLedger] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await fetch('/api/v1/market/ledger');
        const data = await response.json();
        if (data.success) {
          setLedger(data.ledger);
          const sum = data.ledger.reduce((acc, log) => {
             if (log.action === 'MARKET_PURCHASE' && log.details.price) {
                return acc + parseFloat(log.details.price);
             }
             return acc;
          }, 0);
          setTotal(sum);
        }
      } catch (e) { console.error(e); }
    };
    fetchLedger();
  }, []);

  return (
    <div className="animate-fade-in text-slate-200 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4 text-indigo-400">
            <CreditCard className="w-6 h-6" />
            <h3 className="font-bold text-lg text-white">CURRENT BILLING CYCLE</h3>
          </div>
          <p className="text-4xl font-black text-white tracking-tight">${total.toFixed(2)}</p>
          <p className="text-slate-400 text-sm mt-2">Total financial settlement for this node</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col justify-center items-center text-center">
           <Activity className="w-8 h-8 text-emerald-400 mb-2" />
           <h3 className="font-bold text-white">LEDGER SYNCED</h3>
           <p className="text-slate-400 text-sm">Real-time cryptographic audit active</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-400" /> Transaction History
      </h3>
      
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        {ledger.length === 0 ? (
           <div className="p-6 text-center text-slate-400 font-medium">No transactions recorded yet. Access the Provisioning Hub to purchase nodes.</div>
        ) : (
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-800 border-b border-slate-700 text-slate-300 text-sm uppercase tracking-wider">
                 <th className="p-4">Timestamp</th>
                 <th className="p-4">Operation</th>
                 <th className="p-4">Provisioned Asset</th>
                 <th className="p-4 text-right">Settlement Price</th>
               </tr>
             </thead>
             <tbody>
               {ledger.map((log) => (
                 <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                   <td className="p-4 text-slate-300 text-sm">{new Date(log.created_at).toLocaleString()}</td>
                   <td className="p-4">
                     <span className="bg-indigo-500/10 text-indigo-400 py-1 px-3 rounded-full text-xs font-bold border border-indigo-500/20">
                       {log.action}
                     </span>
                   </td>
                   <td className="p-4 text-white font-medium">{log.details.item_name || log.details.item_id || 'Unknown Asset'}</td>
                   <td className="p-4 text-right font-bold text-emerald-400">
                     ${log.details.price ? parseFloat(log.details.price).toFixed(2) : '0.00'}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        )}
      </div>
    </div>
  );
};

export default SubscriptionLedger;
