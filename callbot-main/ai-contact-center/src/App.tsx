import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AnalyticsDashboard } from './views/AnalyticsDashboard';
import { ConversationalAgent } from './views/ConversationalAgent';
import { VoiceCallBot } from './views/VoiceCallBot';
import { SettingsView } from './views/SettingsView';
import { BrainCircuit } from 'lucide-react';

export type ViewType = 'analytics' | 'chatbot' | 'voicebot' | 'settings';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('analytics');

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground selection:bg-primary/30">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 overflow-y-auto w-full">
        <header className="h-16 border-b border-border/40 backdrop-blur-md bg-background/50 sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-medium tracking-tight">Cognitive Contact Centre</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </div>
            <button className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <div className="font-semibold text-sm">JS</div>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
          {activeView === 'analytics' && <AnalyticsDashboard />}
          {activeView === 'chatbot'   && <ConversationalAgent />}
          {activeView === 'voicebot'  && <VoiceCallBot />}
          {activeView === 'settings'  && <SettingsView />}
        </div>
      </main>
    </div>
  );
}
