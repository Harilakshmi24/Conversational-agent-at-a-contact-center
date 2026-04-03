import { LineChart, MessageSquare, Settings, Radio } from 'lucide-react';
import type { ViewType } from '../App';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'analytics', label: 'Insights & Analytics', icon: LineChart,     badge: null },
    { id: 'voicebot',  label: 'Voice Call Bot',        icon: Radio,         badge: 'AI' },
    { id: 'chatbot',   label: 'Conversational AI',     icon: MessageSquare, badge: null },
  ] as const;

  return (
    <aside className="w-80 bg-card/30 border-r border-white/5 backdrop-blur-2xl flex flex-col pt-8 pb-8 z-20">
      <div className="px-8 mb-10">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2.5 bg-primary/20 rounded-2xl border border-primary/30 shadow-inner">
              <Radio className="w-6 h-6 text-primary animate-pulse" />
           </div>
           <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                Cognivox <span className="text-primary not-italic">AI</span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Neural Nexus OS</p>
           </div>
        </div>

        <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mb-6 px-4">
          Main Console
        </div>
        <nav className="space-y-2 flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as ViewType)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-[20px] text-xs font-bold transition-all duration-300 group relative overflow-hidden uppercase tracking-widest",
                  isActive
                    ? "text-white bg-primary/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-primary/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
                )}
                
                <Icon className={cn("w-5 h-5 transition-all duration-500 group-hover:scale-125", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "text-muted-foreground")} />
                {item.label}
                
                {item.id === 'voicebot' && activeView === 'voicebot' && (
                  <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-8">
        <button
          onClick={() => onViewChange('settings')}
          className={cn(
            "flex items-center gap-4 px-5 py-4 rounded-[20px] text-xs font-bold transition-all duration-300 w-full group relative overflow-hidden uppercase tracking-widest",
            activeView === 'settings'
              ? "text-white bg-primary/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-primary/30"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
          )}
        >
          {activeView === 'settings' && (
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
          )}
          <Settings className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-90", activeView === 'settings' ? "text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "text-muted-foreground")} />
          Control Center
        </button>
      </div>
    </aside>
  );
}
