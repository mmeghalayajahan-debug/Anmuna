import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Terminal, 
  Search, 
  Play, 
  Settings, 
  CheckCircle, 
  Activity, 
  Radio, 
  Users, 
  Lock, 
  Globe, 
  ShieldAlert, 
  Binary, 
  Key, 
  LockKeyhole, 
  Database,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NetworkToolsWidget from "./components/NetworkToolsWidget";
import SecurityToolsWidget from "./components/SecurityToolsWidget";
import HashToolsWidget from "./components/HashToolsWidget";
import AboutUsWidget from "./components/AboutUsWidget";
import ContactUsWidget from "./components/ContactUsWidget";
import AdminPanelWidget from "./components/AdminPanelWidget";
import { User, ActivityLog } from "./types";

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState("home");
  const [selectedSubTool, setSelectedSubTool] = useState<string | undefined>(undefined);

  // Auth User state (Local persistence)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("anmuna_user");
    return saved ? JSON.parse(saved) : { id: "3", email: "whitehat_9@anmuna.io", username: "glitch_hunter", role: "user", registeredAt: "2026-06-01T14:45:00Z" };
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Global Direct console search state
  const [directSearchVal, setDirectSearchVal] = useState("");

  // Tools list for Dashboard searches
  const tools = [
    { id: "dns-lookup", name: "DNS Lookup Tracer", desc: "Resolve any, NS, MX, TXT, and A record arrays on specified targets.", category: "network", runs: 2843, sub: "dns" },
    { id: "whois-lookup", name: "Whois Registration Tracer", desc: "Interrogate registrar credentials, expiration dates, and abuse contacts.", category: "network", runs: 1942, sub: "whois" },
    { id: "ip-geolocation", name: "IP Geolocation Positioner", desc: "Trace public hosts mapping coordinates, ISP providers, and regional grids.", category: "network", runs: 4325, sub: "geoip" },
    { id: "port-scanner", name: "Security Port Handshake Scanner", desc: "Audit connection pathways and discover active node pathways safely.", category: "network", runs: 3942, sub: "ports" },
    { id: "ssl-checker", name: "SSL Handshake Signature Auditor", desc: "Interrogate TLS peer certificates, encrypt strength bits, and expiration stamps.", category: "security", runs: 1530, sub: "ssl-checker" },
    { id: "http-analyzer", name: "HTTP Header Audit Suite", desc: "Interrogate HTTP response parameters and compute defensive header safety ratings.", category: "security", runs: 5410, sub: "http-analyzer" },
    { id: "subdomain-finder", name: "Passive Subdomain Finder", desc: "Scan passive DNS pathways and retrieve active network host scopes.", category: "osint", runs: 3824, sub: "subdomain" },
    { id: "website-technology-detector", name: "Website Technology Finder", desc: "Analyze server strings, cookies, and tags to discover software stacks.", category: "security", runs: 2450, sub: "technology-detector" },
    { id: "hash-generator", name: "Cryptographic Hash Generator", desc: "Instantly translate raw string blocks into secure SHA-256 or SHA-1 hashes.", category: "utility", runs: 6920, sub: "hash" },
    { id: "hash-decoder", name: "Rainbow Dictionary Hash Lookup", desc: "Query hashes against standard directories to reverse matched passwords.", category: "utility", runs: 4912, sub: "decoder" },
    { id: "base64-translator", name: "Base64 Encoder / Decoder", desc: "Clean translation interface for encoding or decoding standard base64 formats.", category: "utility", runs: 3204, sub: "base64" },
    { id: "password-generator", name: "Secure Key Generator", desc: "Generate strong cryptographic passwords configured with custom entropy policies.", category: "utility", runs: 8504, sub: "password" }
  ];

  // Dashboard Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tool.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: authUsername || authEmail, password: authPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");
      
      setCurrentUser(data.user);
      localStorage.setItem("anmuna_user", JSON.stringify(data.user));
      setAuthModalOpen(false);
      // Reset fields
      setAuthUsername("");
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, username: authUsername, password: authPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Instantly login
      setCurrentUser(data.user);
      localStorage.setItem("anmuna_user", JSON.stringify(data.user));
      setAuthModalOpen(false);
      setAuthUsername("");
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("anmuna_user");
    setActivePage("home");
  };

  // Fast trigger Bypass login for audit evaluation
  const triggerBypassLogin = (role: "admin" | "expert") => {
    const mockProfile = role === "admin" 
      ? { id: "1", email: "admin@anmuna.io", username: "anmuna_root", role: "admin" as const, registeredAt: new Date().toISOString() }
      : { id: "2", email: "expert_sec@anmuna.io", username: "cyber_sentinel", role: "expert" as const, registeredAt: new Date().toISOString() };
    
    setCurrentUser(mockProfile);
    localStorage.setItem("anmuna_user", JSON.stringify(mockProfile));
    setAuthModalOpen(false);
  };

  // Direct keyword console drill-downs Search execution
  const handleDirectSearch = () => {
    if (!directSearchVal.trim()) return;
    const cleanSearch = directSearchVal.trim().toLowerCase();

    // Check if user specifies tool in prefix like "dns microsoft.com" or "port 192.168.1.1"
    const words = cleanSearch.split(" ");
    let keyword = words[0];
    let queryPayload = words.slice(1).join(" ");

    if (keyword === "dns" || cleanSearch.includes("dns")) {
      setActivePage("network");
      setSelectedSubTool("dns");
    } else if (keyword === "whois" || cleanSearch.includes("whois")) {
      setActivePage("network");
      setSelectedSubTool("whois");
    } else if (keyword === "port" || cleanSearch.includes("port") || keyword === "scan") {
      setActivePage("network");
      setSelectedSubTool("ports");
    } else if (keyword === "ssl" || cleanSearch.includes("ssl")) {
      setActivePage("security");
      setSelectedSubTool("ssl-checker");
    } else if (cleanSearch.includes("head") || cleanSearch.includes("http") || cleanSearch.includes("analyzer")) {
      setActivePage("security");
      setSelectedSubTool("http-analyzer");
    } else if (cleanSearch.includes("tech") || cleanSearch.includes("technology")) {
      setActivePage("security");
      setSelectedSubTool("website-technology-detector");
    } else if (cleanSearch.includes("pass") || cleanSearch.includes("key") || cleanSearch.includes("generator")) {
      setActivePage("utility");
    } else {
      // Default to opening Tools Dashboard and setting the search bar queries
      setActivePage("dashboard");
      setSearchQuery(directSearchVal);
    }
  };

  const handleToolCardClick = (toolId: string, subId: string) => {
    setSelectedSubTool(subId);
    if (toolId.includes("dns") || toolId.includes("whois") || toolId.includes("ip-geolocation") || toolId.includes("port-scanner")) {
      setActivePage("network");
    } else if (toolId.includes("ssl") || toolId.includes("http-analyzer") || toolId.includes("technology-detector")) {
      setActivePage("security");
    } else if (toolId.includes("subdomain")) {
      // Subdomain in our router is on Network Tools widget as "subdomain" simulation or we resolve beautifully
      setSelectedSubTool("dns"); // Fallbackdns resolve
      setActivePage("network");
    } else {
      setActivePage("utility");
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col selection:bg-cyber-green/30 selection:text-white">
      {/* GLOWING HEADER */}
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onOpenAuth={() => { setAuthMode("login"); setAuthModalOpen(true); }}
        activePage={activePage}
      />

      <div className="flex flex-1 relative pt-0">
        
        {/* COLLAPSABLE SIDEBAR */}
        <Sidebar 
          activePage={activePage} 
          setActivePage={(page) => {
            setActivePage(page);
            setSelectedSubTool(undefined);
          }} 
          isAdmin={currentUser?.role === "admin"} 
        />

        {/* CONTAINER CONTENT SLATE */}
        <main className="flex-1 px-4 py-8 md:pl-72 md:pr-8 min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full transition-all">
          
          {/* 1. HOME LANDING VIEW */}
          {activePage === "home" && (
            <div className="space-y-12">
              {/* Futuristic Cyber Banner Grid */}
              <div className="relative py-16 px-6 rounded-3xl border border-cyber-border bg-gradient-to-br from-cyber-card/80 to-black/80 flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Visual Sweep scan lines */}
                <div className="absolute inset-0 opacity-10 cyber-grid"></div>
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-30 shadow-[0_0_15px_#00FF88]"></div>
                
                <div className="relative space-y-6 max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyber-green/20 bg-cyber-green/5 px-4.5 py-1.5 font-mono text-xs tracking-wider text-cyber-green">
                    <span className="inline-block h-2 w-2 rounded-full bg-cyber-green animate-ping"></span>
                    ANMUNA ETHICAL GATEWAY SYSTEM LIVE
                  </div>

                  <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl uppercase leading-none">
                    SECURED CYBERSECURITY <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green via-cyber-cyan to-white glow-green">TACTICAL_DESK</span>
                  </h1>

                  <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                    Access real-time DNS audits, cryptographic TLS cipher verifications, passive OSINT tracing, and response header security rating scores from a single unified node.
                  </p>

                  {/* Direct Command console search */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/80 border border-cyber-border p-2 rounded-2xl max-w-lg mx-auto w-full shadow-inner shadow-cyber-card">
                    <div className="relative flex-1 w-full pl-3 flex items-center">
                      <Terminal className="h-4.5 w-4.5 text-cyber-green mr-2.5 shrink-0" />
                      <input
                        type="text"
                        value={directSearchVal}
                        onChange={(e) => setDirectSearchVal(e.target.value)}
                        placeholder="dns target.com, port 127.0.0.1, or cyber keywords..."
                        className="w-full bg-transparent border-none text-white font-mono text-xs focus:ring-0 focus:outline-none placeholder-slate-600 outline-none"
                        onKeyDown={(e) => e.key === "Enter" && handleDirectSearch()}
                      />
                    </div>
                    <button
                      onClick={handleDirectSearch}
                      className="w-full sm:w-auto rounded-xl bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-display font-black text-[10px] tracking-widest px-5 py-2.5 cursor-pointer transition-colors uppercase"
                    >
                      SEC_CHECK
                    </button>
                  </div>
                </div>
              </div>

              {/* Core Features Quick Dashboard Segment */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                  <h2 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-cyber-cyan" />
                    TACTICAL CATEGORIES OVERVIEW
                  </h2>
                  <button
                    onClick={() => setActivePage("dashboard")}
                    className="text-slate-500 hover:text-cyber-green font-mono text-xs uppercase flex items-center gap-1.5 transition-colors"
                  >
                    EXPLORE_ALL_UTILITIES <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "NETWORK RECON", desc: "Interact with raw DNS lookup arrays, Trace whois records, trace geolocational IPs, and safely map active network ports.", icon: Globe, link: "network", color: "text-cyber-green bg-cyber-green/5" },
                    { title: "CRYPTOGRAPHIC SANCTUM", desc: "Verify secure SSL certificate handshakes, evaluate header audits, and inspect tech environments.", icon: ShieldCheck, link: "security", color: "text-cyber-cyan bg-cyber-cyan/5" },
                    { title: "CYBER CODERS ENCRYPTER", desc: "Instantly encode/decode robust Base64 records, generate robust hashes, decode dictionaries, and map entropic keys.", icon: Binary, link: "utility", color: "text-red-400 bg-red-400/5" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActivePage(item.link)}
                        className="rounded-2xl border border-cyber-border bg-cyber-card/45 p-6 hover:border-cyber-green/30 transition-all cursor-pointer group hover:-translate-y-1 duration-300 relative flex flex-col justify-between min-h-56"
                      >
                        <div className="space-y-4">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 ${item.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-white text-md tracking-wide group-hover:text-cyber-green transition-colors">{item.title}</h4>
                            <p className="text-slate-400 text-xs leading-relaxed mt-1.5">{item.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 group-hover:text-cyber-green transition-all mt-4">
                          <span>OPEN_MODULE_TERMINAL</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Terminal instructions log widget */}
              <div className="rounded-2xl border border-cyber-border bg-black p-6 font-mono text-xs text-slate-400 select-none">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="h-4.5 w-4.5 text-cyber-green" />
                  <span className="font-bold text-slate-300 uppercase text-[10px]">ETHICAL_REMINDER_LOGS</span>
                </div>
                <p className="leading-relaxed">
                  [+] This system, an interactive dashboard node under the alias "Anmuna Server", was initialized exclusively for educational diagnostics. All port check socket loops and header analyzer utilities operate using standard, non-disruptive, benign handshakes to respect system nodes.
                </p>
              </div>
            </div>
          )}

          {/* 2. CORE CYBER TOOLS DASHBOARD GRID */}
          {activePage === "dashboard" && (
            <div className="space-y-8">
              
              {/* Radar and Search segments */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Search / filter control card (7/12 layout) */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white uppercase">ANMUNA_SERVER_UTILITYGRID</h1>
                    <p className="text-sm text-slate-400">Search and filter active tactical cybersecurity tools below.</p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter tool nodes by keywords..."
                        className="w-full rounded-xl border border-cyber-border bg-cyber-gray py-2.5 pl-10 pr-4 font-mono text-xs text-white placeholder-slate-600 focus:border-cyber-green outline-none"
                      />
                    </div>
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="rounded-xl border border-cyber-border bg-cyber-gray px-4 py-2.5 font-mono text-xs text-slate-300 focus:border-cyber-green outline-none"
                    >
                      <option value="all">ALL_CATEGORIES</option>
                      <option value="network">NETWORK_RECON</option>
                      <option value="security">SECURITY_HEX</option>
                      <option value="utility">CYBER_UTILITIES</option>
                    </select>
                  </div>
                </div>

                {/* Cyber Radar Swiper Panel (5/12 layout) */}
                <div className="lg:col-span-5 rounded-2xl border border-cyber-border bg-cyber-card/40 p-5 relative overflow-hidden h-44 flex items-center justify-center">
                  {/* Cyber Sweeping Radar Grid */}
                  <div className="absolute h-36 w-36 rounded-full border border-cyber-green/20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-cyber-green/5 bg-cyber-green/2 animate-ping duration-1000"></div>
                    <div className="h-28 w-28 rounded-full border border-cyber-cyan/10 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full border border-cyber-green/10 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyber-green shadow-[0_0_10px_#00FF88]"></div>
                      </div>
                    </div>
                    {/* Rotating sweeping hand line */}
                    <div 
                      className="absolute top-1/2 left-1/2 h-[72px] w-0.5 bg-gradient-to-t from-transparent via-cyber-green to-cyber-green origin-bottom opacity-60 animate-spin"
                      style={{ animationDuration: "3.5s" }}
                    ></div>
                    {/* Mock target blips */}
                    <span className="absolute top-8 left-12 h-1 w-1 bg-cyber-cyan animate-pulse rounded-full opacity-80 shadow-[0_0_8px_#00D4FF]"></span>
                    <span className="absolute bottom-10 right-4 h-1.5 w-1.5 bg-cyber-green animate-pulse rounded-full opacity-70"></span>
                  </div>
                  <div className="absolute font-mono text-[9px] text-slate-500 top-3 left-3 flex items-center gap-1 tracking-wider">
                    <Radio className="h-3 w-3 text-cyber-green" />
                    AUTONOMOUS_RADAR_SWEEP
                  </div>
                </div>

              </div>

              {/* Tools List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolCardClick(tool.id, tool.sub)}
                    className="group rounded-2xl border border-cyber-border bg-cyber-card/50 p-5 space-y-4 hover:border-cyber-green/40 transition-all cursor-pointer hover:-translate-y-1 duration-200"
                  >
                    <div className="flex items-center justify-between border-b border-cyber-border/40 pb-2.5">
                      <span className="rounded bg-cyber-gray border border-cyber-border px-2 py-0.5 font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                        {tool.category}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-[9px] text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-cyber-green inline-block"></span>
                        <span>RUNS: {tool.runs}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-display font-bold text-white text-xs group-hover:text-cyber-green transition-colors uppercase tracking-wide">
                        {tool.name}
                      </h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[9px] text-cyber-cyan opacity-80 group-hover:translate-x-0.5 transition-transform">
                      <span>ENGAGE SYSTEM PORT</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                ))}
                {filteredTools.length === 0 && (
                  <div className="col-span-full text-center py-24 font-mono text-slate-500 text-xs">
                    [-] No active tools matching the query could be decrypted.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 3. NETWORK RECON CORE TERMINAL PAGE */}
          {activePage === "network" && (
            <NetworkToolsWidget currentUser={currentUser} selectedSubTool={selectedSubTool} />
          )}

          {/* 4. SECURITY HEX SPECIALTY MODULES PAGE */}
          {activePage === "security" && (
            <SecurityToolsWidget currentUser={currentUser} selectedSubTool={selectedSubTool} />
          )}

          {/* 5. PASSIVE UTILITY CRYPTO/PASSWORD SUITES */}
          {activePage === "utility" && (
            <HashToolsWidget />
          )}

          {/* 6. ABOUT ETHICAL GUIDELINE COMPLIANCE */}
          {activePage === "about" && (
            <AboutUsWidget />
          )}

          {/* 7. SECURE PGPTICKET INTAKE CHANNEL */}
          {activePage === "contact" && (
            <ContactUsWidget />
          )}

          {/* 8. ROOT CONSOLE ADMIN CONTROLS */}
          {activePage === "admin" && currentUser?.role === "admin" && (
            <AdminPanelWidget />
          )}

          {activePage === "admin" && currentUser?.role !== "admin" && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center max-w-lg mx-auto space-y-4 font-mono text-xs">
              <LockKeyhole className="h-10 w-10 text-red-500 mx-auto animate-pulse" />
              <div className="space-y-1.5">
                <h3 className="text-white text-md font-bold uppercase tracking-widest">ACCESS DENIED - ROOT REQUIRED</h3>
                <p className="text-slate-500 leading-normal">Operational locks prevent regular security accounts from executing global overrides.</p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => triggerBypassLogin("admin")}
                  className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono text-[10px] tracking-widest font-extrabold px-5 py-2.5 transition-all text-center cursor-pointer uppercase shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                >
                  DECRYPT_BYPASS_AS_ADMIN_ROOT
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* AUTHENTICATION SECURE ACCESS DIALOG (ACCESS_PORTAL DRAWER MODAL) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
          <div className="w-full max-w-sm rounded-2xl border border-cyber-border bg-cyber-card p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-cyber-green"></div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                <span className="font-display font-extrabold text-sm text-white uppercase tracking-wider">
                  ANMUNA_SECURITY_DESK
                </span>
                <button
                  onClick={() => setAuthModalOpen(false)}
                  className="text-slate-500 hover:text-white font-mono text-xs cursor-pointer"
                >
                  [CLOSE]
                </button>
              </div>

              {/* Login / signup toggles */}
              <div className="grid grid-cols-2 gap-2 bg-cyber-dark p-1 rounded-xl border border-cyber-border">
                <button
                  onClick={() => { setAuthMode("login"); setAuthError(null); }}
                  className={`py-1.5 rounded-lg text-[10px] font-mono tracking-widest cursor-pointer uppercase transition-all ${authMode === "login" ? "bg-cyber-green text-cyber-dark font-bold font-semibold" : "text-slate-400"}`}
                >
                  SIGN_IN
                </button>
                <button
                  onClick={() => { setAuthMode("register"); setAuthError(null); }}
                  className={`py-1.5 rounded-lg text-[10px] font-mono tracking-widest cursor-pointer uppercase transition-all ${authMode === "register" ? "bg-cyber-green text-cyber-dark font-bold font-semibold" : "text-slate-400"}`}
                >
                  JOIN_GUILD
                </button>
              </div>

              {/* Error logs */}
              {authError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-[10px] font-mono text-red-400">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Forms */}
              <form onSubmit={authMode === "login" ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4 font-mono text-xs">
                {authMode === "register" && (
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase tracking-wider mb-1">EMAIL_ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full rounded-lg border border-cyber-border bg-cyber-dark p-2.5 text-white focus:border-cyber-green outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[9px] text-slate-500 uppercase tracking-wider mb-1">USERNAME_RECON</label>
                  <input
                    type="text"
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full rounded-lg border border-cyber-border bg-cyber-dark p-2.5 text-white focus:border-cyber-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">SECURITY_PASSPHRASE</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full rounded-lg border border-cyber-border bg-cyber-dark p-2.5 text-white focus:border-cyber-green outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-display font-black text-xs py-3 cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all"
                >
                  {authMode === "login" ? "ESTABLISH_SESSION" : "REGISTER_CREDENTIALS"}
                </button>
              </form>

              {/* Quick bypass shortcuts (extremely user friendly for manual audits verification) */}
              <div className="border-t border-cyber-border pt-4 space-y-2">
                <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider text-center">ANMUNA TESTING OVERRIDES</span>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                  <button
                    onClick={() => triggerBypassLogin("admin")}
                    className="rounded bg-red-950/20 border border-red-500/10 hover:border-red-500/30 text-red-400 py-1 cursor-pointer transition-colors"
                  >
                    BYPASS_ANMUNA_ROOT
                  </button>
                  <button
                    onClick={() => triggerBypassLogin("expert")}
                    className="rounded bg-cyber-cyan/5 border border-cyber-cyan/10 hover:border-cyber-cyan/30 text-cyber-cyan py-1 cursor-pointer transition-colors"
                  >
                    BYPASS_SENTINEL_EXPERT
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Footer system status line */}
      <footer className="h-10 w-full border-t border-cyber-border bg-black/90 flex items-center justify-between px-6 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
        <span>© 2026 Anmuna Server Tactical. All secure nodes reserved.</span>
        <span className="hidden sm:inline-block">AUTHORIZED SCANNING DEPLOYS STANDARD HANDSHAKE POLICY CERTIFIED ONLY</span>
      </footer>

    </div>
  );
}
