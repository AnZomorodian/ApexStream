import { useState } from "react";
import { useStreams } from "@/hooks/use-streams";
import { Link } from "wouter";
import { 
  Activity, 
  Settings, 
  Play, 
  Radio, 
  Globe, 
  MonitorPlay,
  AlertTriangle
} from "lucide-react";
import { UTCClock } from "@/components/Clock";
import { Stream } from "@shared/schema";

export default function Home() {
  const { data: streams, isLoading, isError } = useStreams();
  const [activeStream, setActiveStream] = useState<Stream | null>(null);

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden selection:bg-primary/30">
      
      {/* HEADER */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-card/50 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center transform -skew-x-12 shadow-[0_0_15px_rgba(225,6,0,0.4)]">
            <Activity className="w-5 h-5 text-white transform skew-x-12" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-widest text-white uppercase text-shadow-glow">
            Apex <span className="text-primary">Player</span>
          </h1>
        </div>
        
        <Link 
          href="/admin" 
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider transition-all duration-200 text-muted-foreground hover:text-white hover:bg-secondary border border-transparent hover:border-border"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline font-display">Pit Wall</span>
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-border/50 bg-card/30 shrink-0 z-0 relative">
          <div className="absolute inset-0 racing-stripes opacity-20 pointer-events-none mix-blend-overlay"></div>
          
          <div className="p-4 border-b border-border/30 relative z-10">
            <h2 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" />
              Active Feeds
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 relative z-10">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-secondary/50 rounded-md animate-pulse border border-border/50" />
                ))}
              </div>
            ) : isError ? (
              <div className="p-6 text-center text-destructive border border-destructive/20 bg-destructive/5 rounded-md flex flex-col items-center">
                <AlertTriangle className="w-8 h-8 mb-2 opacity-80" />
                <p className="font-display uppercase text-sm">Telemetry Lost</p>
                <p className="text-xs text-muted-foreground mt-1">Unable to connect to databank.</p>
              </div>
            ) : streams?.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground border border-border/50 bg-secondary/20 rounded-md">
                <MonitorPlay className="w-8 h-8 mb-2 mx-auto opacity-50" />
                <p className="font-display uppercase text-sm">No Feeds Available</p>
              </div>
            ) : (
              streams?.map(stream => (
                <button
                  key={stream.id}
                  onClick={() => setActiveStream(stream)}
                  className={`
                    w-full text-left p-4 rounded-md transition-all duration-300 relative overflow-hidden group
                    border ${activeStream?.id === stream.id 
                      ? 'bg-primary/10 border-primary/50 shadow-[inset_0_0_20px_rgba(225,6,0,0.15)]' 
                      : 'bg-card border-border/50 hover:border-primary/30 hover:bg-secondary/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/50'
                    }
                  `}
                >
                  {/* Selected Indicator line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${activeStream?.id === stream.id ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/50'}`} />
                  
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <h3 className="font-display font-bold text-white uppercase text-base truncate pr-2 tracking-wide group-hover:text-primary transition-colors">
                      {stream.title}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary live-dot" />
                      <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Live</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3 pl-2 text-xs font-sans text-muted-foreground">
                    <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded border border-border/50">
                      <Tv className="w-3 h-3" /> {stream.quality}
                    </span>
                    <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded border border-border/50 truncate">
                      <Globe className="w-3 h-3" /> {stream.lang.toUpperCase()}
                    </span>
                    <span className="truncate flex-1 text-right">{stream.provider}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* PLAYER AREA */}
        <main className="flex-1 bg-black relative flex items-center justify-center overflow-hidden z-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          {activeStream ? (
            <div className="w-full h-full relative animate-in fade-in duration-500">
              <iframe
                src={activeStream.url}
                title={activeStream.title}
                allowFullScreen
                frameBorder="0"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground z-10 animate-in zoom-in-95 duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
                <Play className="w-20 h-20 text-border relative z-10" strokeWidth={1} />
              </div>
              <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-white/80 font-light mb-2">
                Ready for <span className="text-primary font-bold">Lights Out?</span>
              </h2>
              <p className="font-sans text-sm text-muted-foreground/80 tracking-wide max-w-md text-center">
                Select a transmission feed from the pit wall to begin streaming.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* STATUS BAR */}
      <footer className="h-10 flex items-center justify-between px-6 border-t border-border/50 bg-background shrink-0 z-10 text-xs">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${activeStream ? 'bg-primary live-dot' : 'bg-muted-foreground'}`} />
            <span className="font-display uppercase tracking-widest">
              {activeStream ? 'Receiving Data' : 'Standby'}
            </span>
          </div>
          {activeStream && (
            <>
              <div className="w-px h-3 bg-border/50" />
              <span className="font-mono text-white/80 truncate max-w-[200px] sm:max-w-md">
                SRC: {activeStream.streamId}
              </span>
            </>
          )}
        </div>
        
        <UTCClock />
      </footer>
    </div>
  );
}

// Temporary icon fallbacks if not in lucide
const Tv = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
);
