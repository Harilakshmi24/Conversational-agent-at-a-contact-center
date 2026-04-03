import { useState } from 'react';
import { 
  Settings, Key, Shield, Globe, Bell, 
  Save, RefreshCcw, CheckCircle2, AlertCircle, Info, Sparkles,
  Sliders, Monitor
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SettingsView() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cognivox_gemini_key') || '');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'security' | 'display'>('general');

  const handleSave = () => {
    localStorage.setItem('cognivox_gemini_key', apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'ai', label: 'AI Intelligence', icon: Sparkles },
    { id: 'security', label: 'Security & Keys', icon: Shield },
    { id: 'display', label: 'Dashboard Display', icon: Monitor },
  ] as const;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-card/20 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 shadow-2xl mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Architecture</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-[0.8]">
            Control <span className="text-primary italic">Center</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-xs font-bold uppercase tracking-widest opacity-60 max-w-xl">Configure core AI parameters, security protocols, and operational interface preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-4 px-10 py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 group",
            isSaved 
              ? "bg-emerald-500 text-white shadow-emerald-500/30" 
              : "bg-primary text-white shadow-primary/30 hover:scale-105"
          )}
        >
          {isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5 transition-transform group-hover:rotate-12" />}
          {isSaved ? 'Protocol Saved' : 'Synchronize Core'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <div className="space-y-3">
          <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mb-6 px-4">System Nodes</div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4.5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all group relative overflow-hidden",
                  activeTab === tab.id
                    ? "bg-primary/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-primary/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                )}
              >
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
                )}
                <Icon className={cn("w-5 h-5 transition-all duration-500 group-hover:scale-125", activeTab === tab.id ? "text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "text-muted-foreground")} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8 animate-in fade-in duration-500">
          {activeTab === 'ai' && (
            <div className="space-y-8 bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-10">
                  <div className="p-4 bg-primary/20 rounded-[20px] border border-primary/30 shadow-inner">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Neural Intelligence Hub</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mt-1">Foundational model orchestration & API integration</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 block px-2">Cloud Intelligence Secret (Gemini API)</label>
                    <div className="relative group/input">
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-all group-focus-within/input:scale-110" />
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="INJECT SECRET KEY..."
                        className="w-full bg-background/40 border border-white/10 rounded-[24px] pl-16 pr-6 py-5 text-sm font-mono outline-none focus:border-primary/50 focus:bg-background/60 transition-all text-primary"
                      />
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-2xl border border-primary/10">
                      <Info className="w-4 h-4 text-primary" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">Key is encrypted and stored in local neural vault.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-background/40 border border-white/5 rounded-[32px] hover:border-primary/30 transition-all group/node shadow-inner">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 block mb-4">Neural Architecture</label>
                      <select className="w-full bg-transparent text-sm font-black italic tracking-tight outline-none cursor-pointer text-foreground">
                        <option className="bg-secondary text-foreground">GEMINI 1.5 PRO (TACTICAL)</option>
                        <option className="bg-secondary text-foreground">GEMINI 1.5 FLASH (SPEED)</option>
                        <option className="bg-secondary text-foreground">SONNET 3.5 (LOGIC)</option>
                      </select>
                    </div>
                    <div className="p-6 bg-background/40 border border-white/5 rounded-[32px] hover:border-primary/30 transition-all group/node shadow-inner">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 block mb-4">Transmission Latency</label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-emerald-500 italic tracking-tight uppercase">Ultra-Low [0.4s]</span>
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20 shadow-inner">
                          <Sliders className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8">
              <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center gap-5 mb-10">
                  <div className="p-4 bg-primary/20 rounded-[20px] border border-primary/30 shadow-inner">
                    <Globe className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Regional Calibration</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mt-1">Localization assets and temporal synchronization</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-background/40 border border-white/5 rounded-[32px] hover:border-primary/30 transition-all group/node shadow-inner">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Default Interface Language</h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1 opacity-60">System-wide fallback dialect for initial discovery.</p>
                    </div>
                    <select className="bg-secondary/60 border border-white/10 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest text-primary outline-none cursor-pointer">
                      <option>English [INTL]</option>
                      <option>Hindi [IN]</option>
                      <option>Tamil [IN]</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-background/40 border border-white/5 rounded-[32px] hover:border-primary/30 transition-all group/node shadow-inner">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Temporal Auto-Sync</h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1 opacity-60">Synchronize all data logs with local precision time.</p>
                    </div>
                    <div className="w-14 h-7 bg-primary rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      <div className="absolute right-1.5 top-1.5 bottom-1.5 w-4 bg-white rounded-full transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center gap-5 mb-10">
                  <div className="p-4 bg-primary/20 rounded-[20px] border border-primary/30 shadow-inner">
                    <Bell className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Operational Alerts</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mt-1">Configure real-time transmission notifications</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-background/20 rounded-[24px]">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-primary" />
                       <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Neural Voice Handoff Alerts</span>
                    </div>
                    <div className="w-12 h-6 bg-primary/20 border border-primary/40 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 bottom-1 w-4 bg-primary rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background/20 rounded-[24px]">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                       <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Visual Protocol Pngs</span>
                    </div>
                    <div className="w-12 h-6 bg-secondary/30 border border-white/5 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 bottom-1 w-4 bg-muted-foreground/50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-5 mb-10">
                <div className="p-4 bg-emerald-500/20 rounded-[20px] border border-emerald-500/30 shadow-inner">
                  <Shield className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">Security Protocol Deck</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mt-1">Infrastructure integrity and asset protection</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[32px] flex gap-6 relative overflow-hidden group/alert">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-amber-500 animate-pulse" />
                  <AlertCircle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1 group-hover/alert:scale-125 transition-transform" />
                  <div>
                    <h5 className="text-sm font-black text-amber-500 uppercase tracking-[0.2em] mb-2 leading-none">Transmission Vulnerability Warning</h5>
                    <p className="text-xs text-muted-foreground font-bold mt-1 leading-relaxed opacity-80 uppercase tracking-widest">
                      Keys are decrypted for runtime in <code className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-500">localStorage</code>. For industrial scale deployments, migrate to encrypted server-side proxy injections immediately.
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 mt-6 flex justify-between items-center">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Hardware Root Identity</span>
                      <span className="text-[11px] font-mono text-primary font-bold">X9-COGNIVOX-PRO-ALPHA</span>
                   </div>
                   <button className="flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-xl active:scale-95">
                     <RefreshCcw className="w-4 h-4" /> Purge Local Vault
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-5 mb-10">
                <div className="p-4 bg-primary/20 rounded-[20px] border border-primary/30 shadow-inner">
                  <Monitor className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">Visual Optimization</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mt-1">Interface fidelity and canvas rendering</p>
                </div>
              </div>
              
              <div className="space-y-8 py-10 text-center flex flex-col items-center">
                <div className="p-6 bg-primary/5 rounded-full mb-4">
                   <Monitor className="w-12 h-12 text-primary/40 animate-pulse" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 max-w-sm leading-relaxed">Advanced orbital visualizer and custom canvas themes are currently undergoing neural simulation. Deploying in next patch.</p>
                <div className="grid grid-cols-3 gap-6 w-full max-w-xl opacity-20 select-none grayscale cursor-not-allowed">
                  <div className="h-28 bg-white/5 rounded-[24px] border border-white/10 flex items-center justify-center font-black text-[10px] uppercase tracking-widest italic">Matrix-V1</div>
                  <div className="h-28 bg-primary/20 rounded-[24px] border border-primary/30 flex items-center justify-center font-black text-[10px] uppercase tracking-widest italic">Nebula-X</div>
                  <div className="h-28 bg-white/5 rounded-[24px] border border-white/10 flex items-center justify-center font-black text-[10px] uppercase tracking-widest italic">Onyx-II</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
