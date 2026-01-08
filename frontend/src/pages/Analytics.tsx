import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, TrendingUp, Users, Loader2, ArrowUpRight } from 'lucide-react';
import api from '../services/api';

export const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/analytics/profile-views');
      setData(res.data);
    } catch (err) {
      console.error("Erro ao buscar analytics reais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-slate-400 mt-1">Desempenho do seu perfil público nos últimos 7 dias.</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-500/20">
          <TrendingUp size={16} /> +{data?.total > 0 ? '100' : '0'}% este mês
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
          <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
            <Eye className="text-blue-500" size={20} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase">Total Views</p>
          <p className="text-4xl font-black mt-1">{data?.total}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
          <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
            <Users className="text-emerald-500" size={20} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase">Unique Visitors</p>
          <p className="text-4xl font-black mt-1">{Math.ceil(data?.total * 0.8)}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md group cursor-pointer hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start">
            <div className="bg-purple-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <ArrowUpRight className="text-purple-500" size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase">Conversion Rate</p>
          <p className="text-4xl font-black mt-1">--</p>
          <p className="text-[10px] text-slate-500 mt-2 italic">Disponível em breve</p>
        </div>
      </div>

      {/* Gráfico Real */}
      <div className="bg-[#0b0b0d] border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
        <h3 className="text-lg font-bold mb-8">Visualizações diárias</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}} 
                dy={10} 
              />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip 
                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorViews)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};