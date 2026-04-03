import { useState } from 'react';
import { CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { TrendingUp, Users, AlertCircle, Clock, ArrowUpRight, ArrowDownRight, FileDown, Loader2, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockData = [
  { name: 'Jan', queries: 4000, resolved: 2400 },
  { name: 'Feb', queries: 3000, resolved: 1398 },
  { name: 'Mar', queries: 2000, resolved: 9800 },
  { name: 'Apr', queries: 2780, resolved: 3908 },
  { name: 'May', queries: 1890, resolved: 4800 },
  { name: 'Jun', queries: 2390, resolved: 3800 },
  { name: 'Jul', queries: 3490, resolved: 4300 },
];

const complaintThemes = [
  { topic: 'Delivery Delays', volume: 843, trend: 'up', percentage: '+12%' },
  { topic: 'Refund Status', volume: 654, trend: 'down', percentage: '-5%' },
  { topic: 'Product Quality', volume: 432, trend: 'up', percentage: '+2%' },
  { topic: 'App Glitches', volume: 210, trend: 'down', percentage: '-18%' },
];

export function AnalyticsDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate complex data aggregation and export
    setTimeout(() => {
      setIsGenerating(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      
      // In a real app, this would trigger a window.open or blob download
      console.log("Cognivox Intelligence Report Generated Successfully.");
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10 fade-in duration-500">
           <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/20 backdrop-blur-xl">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <p className="font-black text-xs uppercase tracking-widest leading-none">Report Ready</p>
                <p className="text-[10px] opacity-90 mt-1 uppercase tracking-[0.2em] font-bold">Cognivox-Insights-Q2.pdf</p>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card/20 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Operations Hub</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-[0.8]">
            Cognitive <span className="text-primary italic">Intelligence</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-xs font-bold uppercase tracking-widest opacity-60">System-wide performance monitoring and data metrics</p>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={isGenerating}
            onClick={handleGenerateReport}
            className={cn(
              "px-8 py-4 font-black rounded-2xl shadow-[0_10px_40px_rgba(139,92,246,0.3)] transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-3",
              isGenerating 
                ? "bg-secondary text-muted-foreground cursor-not-allowed border border-border/50" 
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
            {isGenerating ? 'Compiling Hub Data...' : 'Generate Intelligence Report'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Interactions', value: '24,593', trend: '+14.5%', positive: true },
          { icon: Clock, label: 'Avg Handle Time', value: '2m 14s', trend: '-30s', positive: true },
          { icon: AlertCircle, label: 'Escalation Rate', value: '12.4%', trend: '-2.1%', positive: true },
          { icon: TrendingUp, label: 'AI Resolution', value: '78.2%', trend: '+4.5%', positive: true },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all hover:-translate-y-1">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{kpi.label}</p>
                  <h3 className="text-3xl font-black text-foreground italic tracking-tighter">{kpi.value}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className={cn("mt-6 flex items-center text-[10px] font-black uppercase tracking-widest font-mono p-2 rounded-xl bg-background/40 border border-white/5", kpi.positive ? "text-emerald-500" : "text-rose-500")}>
                {kpi.positive ? <ArrowUpRight className="w-4 h-4 mr-1.5" /> : <ArrowDownRight className="w-4 h-4 mr-1.5" />}
                {kpi.trend} <span className="opacity-40 ml-1 text-muted-foreground whitespace-pre">  PERIOD PROGRESS</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 bg-card/30 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 shadow-2xl overflow-hidden flex flex-col">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
               <h3 className="text-xl font-black text-foreground tracking-tighter uppercase italic">Neural Resolution Flow</h3>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global AI performance vs Human Handoff</p>
            </div>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2.5 text-primary"> <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]" /> Total Inbound </div>
              <div className="flex items-center gap-2.5 text-[#8b5cf6]"> <div className="w-3 h-3 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.6)]" /> AI Solution </div>
            </div>
          </div>
          <div className="h-80 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="white" opacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', fontSize: '10px', backdropFilter: 'blur(12px)' }} />
                <Area type="monotone" dataKey="queries" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorQueries)" />
                <Area type="monotone" dataKey="resolved" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 shadow-2xl flex flex-col">
          <div className="space-y-1 mb-8">
             <h3 className="text-xl font-black text-foreground tracking-tighter uppercase italic">Hot-Fix Topics</h3>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active issue categorization & trends</p>
          </div>
          <div className="space-y-5 flex-1">
            {complaintThemes.map((topic, i) => (
              <div key={i} className="flex flex-col gap-3.5 p-5 bg-background/40 rounded-[24px] border border-white/5 hover:bg-white/5 hover:border-primary/30 transition-all cursor-pointer group shadow-sm active:scale-95">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{topic.topic}</span>
                  <div className={`flex items-center text-[9px] font-black px-2.5 py-1 rounded-full border tracking-widest ${topic.trend === 'up' ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'}`}>
                    {topic.trend === 'up' ? 'PRIORITY' : 'STABLE'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Volume Status</span>
                      <span className="text-sm font-black italic tracking-tighter text-foreground">{topic.volume} <span className="text-[10px] text-muted-foreground not-italic tracking-normal">UNITS</span></span>
                  </div>
                  <div className={cn("text-[11px] font-black font-mono", topic.trend === 'up' ? "text-rose-500" : "text-emerald-500")}>
                     {topic.percentage}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 bg-secondary/50 hover:bg-secondary border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all text-muted-foreground hover:text-white group">
             Full Analytical Deck <ArrowUpRight className="inline-block w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
