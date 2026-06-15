import React from "react";
import { 
  Home, 
  LayoutGrid, 
  Globe, 
  ShieldAlert, 
  Search, 
  Binary, 
  Users, 
  Mail, 
  Lock, 
  Menu, 
  X,
  PlusCircle,
  HelpCircle
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isAdmin: boolean;
}

export default function Sidebar({ activePage, setActivePage, isAdmin }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: "home", label: "HOME_START", icon: Home, roles: ["all"] },
    { id: "dashboard", label: "TOOLS_DASHBOARD", icon: LayoutGrid, roles: ["all"] },
    { id: "network", label: "NETWORK_ANALYSIS", icon: Globe, roles: ["all"] },
    { id: "security", label: "SECURITY_HEX_RECON", icon: ShieldAlert, roles: ["all"] },
    { id: "utility", label: "CYBER_UTILITIES", icon: Binary, roles: ["all"] },
    { id: "about", label: "WHITEHAT_MISSIONS", icon: Users, roles: ["all"] },
    { id: "contact", label: "SECURE_MAIL_DESK", icon: Mail, roles: ["all"] },
    { id: "admin", label: "CORE_ADMIN_PANEL", icon: Lock, roles: ["admin"], badge: "ROOT" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-cyber-green text-cyber-dark shadow-lg md:hidden cursor-pointer"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Main Sidebar Wrapper */}
      <aside className={`
        fixed bottom-0 top-16 left-0 z-30 flex w-64 flex-col border-r border-cyber-border bg-cyber-dark px-4 py-6 transition-transform duration-300 md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Navigation Section */}
        <div className="flex flex-col flex-1 justify-between">
          <nav className="space-y-1.5">
            <div className="px-3 mb-4 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              MAIN NAVIGATION
            </div>
            {menuItems.map((item) => {
              // Hide admin items from non-admins
              if (item.roles.includes("admin") && !isAdmin) return null;

              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border font-mono text-xs tracking-wider transition-all cursor-pointer group
                    ${isActive 
                      ? "bg-cyber-green/10 border-cyber-green/40 text-cyber-green font-medium" 
                      : "bg-transparent border-transparent text-slate-400 hover:bg-cyber-gray hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-cyber-green" : "text-slate-400 group-hover:text-cyber-cyan transition-colors"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-red-900/40 border border-red-500/30 px-1 py-0.5 text-[8px] font-bold text-red-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Environment block */}
          <div className="rounded-xl border border-cyber-border bg-cyber-gray/30 p-4 font-mono text-[10px]">
            <div className="text-slate-500 mb-1 tracking-wider uppercase font-semibold">ENVIRONMENT INFORMATION</div>
            <div className="space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>PLATFORM:</span>
                <span className="text-white">v2.12-SHIELD</span>
              </div>
              <div className="flex justify-between">
                <span>CPU LOADING:</span>
                <span className="text-cyber-cyan">3.12%</span>
              </div>
              <div className="flex justify-between">
                <span>BUFFER STATUS:</span>
                <span className="text-cyber-green">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
