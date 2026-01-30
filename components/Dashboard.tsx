
import React, { useMemo } from 'react';
import { Transaction, AppView } from '../types';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronRight, 
  RefreshCcw, 
  PiggyBank, 
  TrendingUp, 
  Plus, 
  ArrowRightLeft, 
  CreditCard, 
  HandCoins, 
  ShieldCheck 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  totalBalance: number;
  onNavigate: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, totalBalance, onNavigate }) => {
  const chartData = useMemo(() => {
    return transactions.slice(0, 7).reverse().map((tx, idx) => ({
      name: tx.date.split('/')[0],
      value: Math.abs(tx.amount)
    }));
  }, [transactions]);

  const QuickAction = ({ icon, label, view, color }: { icon: React.ReactNode, label: string, view: AppView, color: string }) => (
    <button 
      onClick={() => onNavigate(view)}
      className="flex flex-col items-center gap-3 group"
    >
      <div className={`w-14 h-14 ${color} rounded-[1.2rem] flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-active:scale-95 transition-all duration-300`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter text-center leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 sm:pb-8 animate-in fade-in duration-700">
      
      {/* Quick Actions Bar - Pichincha Style */}
      <div className="grid grid-cols-4 gap-2 md:gap-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 overflow-x-auto no-scrollbar no-print">
         <QuickAction icon={<ArrowRightLeft size={24} />} label="Transferir" view={AppView.TRANSFERS} color="bg-[#14532D]" />
         <QuickAction icon={<HandCoins size={24} />} label="Créditos" view={AppView.CREDITS} color="bg-[#14532D]" />
         <QuickAction icon={<CreditCard size={24} />} label="Cuentas" view={AppView.SAVINGS as any} color="bg-emerald-600" />
         <QuickAction icon={<ShieldCheck size={24} />} label="Seguridad" view={AppView.PROFILE} color="bg-[#FACC15] !text-[#14532D]" />
      </div>

      {/* Banner de Saldo - Pichincha Style Mobile-First */}
      <div className="bg-[#14532D] rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl border-b-[8px] border-[#FACC15]">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
               <div className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FACC15]">Saldo Consolidado</span>
            </div>
            <p className="text-sm font-medium opacity-60 mb-2">Total Disponible en Patate</p>
            <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tighter flex items-start gap-1">
              <span className="text-2xl font-bold mt-2">$</span>
              {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h1>
            <div className="flex items-center gap-4 mt-6">
                <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                  Cuenta: **** 0129
                </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => onNavigate(AppView.TRANSFERS)}
              className="w-full md:w-auto bg-[#FACC15] hover:bg-yellow-300 text-[#14532D] px-10 py-5 rounded-2xl font-black text-sm transition-all shadow-2xl hover:-translate-y-1 active:scale-95 whitespace-nowrap uppercase tracking-widest"
            >
              Transferir Dinero
            </button>
            <button 
              onClick={() => onNavigate(AppView.CREDITS)}
              className="w-full md:w-auto bg-emerald-800/40 hover:bg-emerald-800/60 text-white px-10 py-5 rounded-2xl font-black text-sm transition-all backdrop-blur-md border border-white/10 uppercase tracking-widest"
            >
              Simular Crédito
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
        <div className="absolute right-10 bottom-10 opacity-10">
           <Wallet size={160} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Gráfico de Actividad */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[400px]">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Tu Evolución</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saldo vs Tiempo</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <TrendingUp size={20} className="text-[#14532D]" />
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.length > 0 ? chartData : [{name: 'Ene', value: 0}, {name: 'Feb', value: 10}]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14532D" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#14532D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ stroke: '#14532D', strokeWidth: 1 }}
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontSize: '12px', fontWeight: 'bold'}} 
                  />
                  <Area type="monotone" dataKey="value" stroke="#14532D" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Movimientos Recientes */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Últimos Movimientos</h3>
                <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Ver Todo</button>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
                {transactions.length > 0 ? transactions.slice(0, 10).map((t) => (
                  <div key={t.id} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-3 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      t.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {t.type === 'CREDIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1">{t.description}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{t.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${t.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {t.type === 'CREDIT' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center">
                    <PiggyBank size={64} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest italic">Sin transacciones registradas</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Seguridad Certificada</p>
                 <div className="flex justify-center gap-2 text-emerald-600">
                    <ShieldCheck size={20} />
                    <span className="text-xs font-bold">Transacción Cifrada</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
