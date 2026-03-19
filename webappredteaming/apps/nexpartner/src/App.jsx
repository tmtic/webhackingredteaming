import React, { useState, useEffect } from 'react';
import { Shield, FileText, Lock } from 'lucide-react';
const App = () => {
  const [data, setData] = useState(null);
  const ID = new URLSearchParams(window.location.search).get('id') || '101';
  useEffect(() => {
    fetch(`/api/v1/commercial/contracts/view?id=${ID}`).then(r => r.json()).then(setData);
  }, [ID]);
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-[#1e293b] rounded-3xl p-8 border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 text-blue-500 mb-8 font-black text-2xl italic"><Shield fill="currentColor"/> NEXPARTNER</div>
        <h1 className="text-xl font-bold mb-4">Contrato: {data?.company_name}</h1>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-sm text-slate-500 uppercase font-bold">Valor do Contrato (Client-Trust)</p>
          <p id="contract-price" className="text-3xl font-black text-white">{data?.contract_value}</p>
        </div>
        <div className="mt-6 p-4 bg-red-900/20 border border-red-900/30 rounded-xl">
          <p className="text-red-400 text-xs font-bold uppercase mb-2">Segredos Internos</p>
          <code className="text-sm">{data?.secret_details}</code>
        </div>
      </div>
    </div>
  );
};
export default App;
