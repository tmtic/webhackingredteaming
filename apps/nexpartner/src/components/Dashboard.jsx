import React, { useState } from 'react';
import SubscriptionLedger from './SubscriptionLedger';
import Marketplace from './Marketplace';

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="h-full flex flex-col">
      
      {/* Sub-menu estilo SaaS Profissional (Dark Mode) */}
      <div className="flex space-x-8 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${
            activeTab === 'overview' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          SETTLEMENT LEDGER
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${
            activeTab === 'marketplace' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          PROVISIONING HUB
        </button>
      </div>

      {/* Renderização do Conteúdo */}
      <div className="flex-1">
        {activeTab === 'overview' && <SubscriptionLedger />}
        {activeTab === 'marketplace' && <Marketplace />}
      </div>

    </div>
  );
};

export default Dashboard;
