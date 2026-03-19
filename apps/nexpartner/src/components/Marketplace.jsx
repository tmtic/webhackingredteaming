import React, { useState } from 'react';
import { ShoppingBag, Zap } from 'lucide-react';

const Marketplace = () => {
  const [status, setStatus] = useState(null);
  const resources = [
    { id: 'node-gold-99', name: 'Sovereign Node Gold', price: 5000, desc: 'High-performance edge computing unit with dedicated mesh routing.' },
    { id: 'vault-secure-01', name: 'Quantum Vault Storage', price: 1200, desc: 'Encrypted storage with zero-knowledge architecture.' }
  ];

  const handlePurchase = async (item) => {
    const response = await fetch('/api/v1/market/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: item.id, item_name: item.name, price: item.price, currency: 'USD' })
    });
    const data = await response.json();
    setStatus(data.message);
  };

  return (
    <div className="animate-fade-in text-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {resources.map(item => (
          <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg hover:border-indigo-500 hover:bg-slate-800 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400"><Zap className="w-5 h-5" /></div>
              <span className="text-2xl font-black text-white tracking-tight">${item.price}</span>
            </div>
            <h3 className="font-bold text-lg text-white mb-2">{item.name}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{item.desc}</p>
            <button onClick={() => handlePurchase(item)} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-colors uppercase tracking-wider text-sm shadow-lg shadow-indigo-600/20">
              Provision Resource
            </button>
          </div>
        ))}
      </div>
      {status && (
        <div className="mt-8 p-4 bg-emerald-900/30 text-emerald-400 rounded-lg border border-emerald-500/50 font-medium flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          {status}
        </div>
      )}
    </div>
  );
};
export default Marketplace;
