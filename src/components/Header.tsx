import React from "react";
import { Shield, Terminal, User as UserIcon, LogOut, CheckCircle, Wifi } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  activePage: string;
}

export default function Header({ currentUser, onLogout, onOpenAuth, activePage }: HeaderProps) {
  const [ping, setPing] = React.useState(18);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPing(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 5 ? 5 : next > 35 ? 35 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-cyber-border bg-cyber-dark/80 px-6 backdrop-blur-md">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-green/30 bg-cyber-green/5 text-cyber-green shadow-[0_0_15px_rgba(0,255,136,0.15)]">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <span className="font-display text-lg font-bold tracking-wider text-white">
            ANMUNA<span className="text-cyber-green">_SERVER</span>
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyber-green/80">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyber-green"></span>
            SYS_SECURE_NODE_01
          </div>
        </div>
      </div>

      {/* Center status bar for desktop */}
      <div className="hidden items-center gap-6 font-mono text-xs sm:flex">
        <div className="flex items-center gap-2 text-slate-400">
          <Wifi className="h-3.5 w-3.5 text-cyber-cyan" />
          <span>PING: <span className="text-cyber-cyan font-semibold">{ping}ms</span></span>
        </div>
        <div className="h-4 w-[1px] bg-cyber-border"></div>
        <div className="flex items-center gap-2 text-slate-400">
          <CheckCircle className="h-3.5 w-3.5 text-cyber-green" />
          <span>INTEGRITY: <span className="text-cyber-green font-semibold">100%</span></span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-mono text-xs font-semibold text-slate-200">
                {currentUser.username}
              </div>
              <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                currentUser.role === "admin" 
                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                  : currentUser.role === "expert" 
                  ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20" 
                  : "bg-cyber-green/10 text-cyber-green border border-cyber-green/20"
              }`}>
                {currentUser.role}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyber-border bg-cyber-gray text-slate-300">
              <UserIcon className="h-4 w-4" />
            </div>
            <button
              onClick={onLogout}
              title="Logout session"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border border-cyber-border bg-cyber-gray text-slate-400 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-lg border border-cyber-green bg-cyber-green/10 px-4 py-1.5 font-display text-xs font-semibold text-cyber-green hover:bg-cyber-green hover:text-cyber-dark transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(0,255,136,0.1)] hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]"
          >
            <Terminal className="h-3.5 w-3.5" />
            ACCESS_PORTAL
          </button>
        )}
      </div>
    </header>
  );
}
