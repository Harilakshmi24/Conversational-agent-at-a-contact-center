import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ConversationalAgent } from './ConversationalAgent';
import { VoiceCallBot } from './VoiceCallBot';
import { LayoutGrid, Radio, MessageSquare, LineChart } from 'lucide-react';

export function UnifiedHub() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-primary" /> Multi-Channel Hub
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time control across all AI agents and intelligence channels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Row 1: Analytics & Voice (Voice is usually high-priority) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <LineChart className="w-4 h-4" /> Live Performance Analytics
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm overflow-hidden">
            <AnalyticsDashboard />
          </div>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Radio className="w-4 h-4 text-emerald-500" /> Voice Call Bot Control
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm h-full max-h-[600px] overflow-y-auto overflow-x-hidden">
            {/* Embedded Voice Bot: We'll force a smaller layout if needed */}
            <VoiceCallBot />
          </div>
        </div>

        {/* Row 2: Conversational AI (Full Width) */}
        <div className="xl:col-span-12 space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <MessageSquare className="w-4 h-4 text-purple-500" /> Conversational Chat AI
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
             <div className="h-[700px]"> {/* Fixed height for the chat within the hub */}
                <ConversationalAgent />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
