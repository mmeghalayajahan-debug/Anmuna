import React from "react";
import { 
  Lock, 
  Terminal, 
  Trash2, 
  CheckCircle, 
  ShieldAlert, 
  Users, 
  Settings, 
  ToggleLeft, 
  ToggleRight,
  ShieldCheck,
  Zap,
  Play
} from "lucide-react";
import { User, ActivityLog } from "../types";

export default function AdminPanelWidget() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [logs, setLogs] = React.useState<ActivityLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Tools status toggle state
  const [toolsState, setToolsState] = React.useState<Record<string, boolean>>({
    "dns-lookup": true,
    "whois-lookup": true,
    "ip-geolocation": true,
    "ssl-checker": true,
    "http-analyzer": true,
    "port-scanner": true,
    "subdomain-finder": true
  });

  // Sandbox Firewall Simulator Variables
  const [fwStatus, setFwStatus] = React.useState<"PASSIVE" | "SHIELD_ACTIVE" | "MITIGATING">("PASSIVE");
  const [fwIpInput, setFwIpInput] = React.useState("198.51.100.42");
  const [fwLogs, setFwLogs] = React.useState<string[]>([
    "[*] Firewall system loaded. Integrity check complete.",
    "[+] Active rules applied: Drop all invalid headers from WAN."
  ]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Load users
      const resUsers = await fetch("/api/users");
      const dataUsers = await resUsers.json();
      if (resUsers.ok) setUsers(dataUsers.users);

      // 2. Load logs
      const resLogs = await fetch("/api/logs");
      const dataLogs = await resLogs.json();
      if (resLogs.ok) setLogs(dataLogs.logs);

    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAdminData();
  }, []);

  const clearAllLogs = () => {
    setLogs([]);
  };

  const toggleTool = (toolId: string) => {
    setToolsState(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  const triggerFirewallAudit = () => {
    const freshLogs = [
      `[*] SIMULATING TRAFFIC FLOW FROM RAW IP: ${fwIpInput}...`,
      `[!] Suspicious payload payload detected: SQL-injection query block 'UNION SELECT NULL...'`,
      `[+] Rule #42 triggered: Rate-limiting matched routing.`,
      `[+] FIREWALL BLOCK ACTION SUCCESSFUL.`
    ];
    setFwStatus("MITIGATING");
    
    // Cycle state
    setTimeout(() => {
      setFwLogs(prev => [...prev, ...freshLogs]);
      setFwStatus("SHIELD_ACTIVE");
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Lock className="h-6 w-6 text-red-500" />
          CORE_ADMIN_PANEL_ROOT
        </h1>
        <p className="text-sm text-slate-400">Restricted secure administrator node. Oversee active platform signups, purge operation logs, toggle public microservices, and configure firewall parameters.</p>
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center gap-2.5 font-mono text-xs text-cyber-green">
          <Settings className="h-5 w-5 animate-spin" />
          <span>LOADING ROOT ENVIRONMENT PARAMETERS...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* USER ROSTER & SERVICES TOGGLES - Grid span 7 */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Active tool lockouts */}
            <div className="rounded-2xl border border-cyber-border bg-cyber-card/40 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-slate-200 flex items-center gap-2">
                <Settings className="h-4.5 w-4.5 text-cyber-green" />
                SERVICE PORT LOCKOUT CONTROLS
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">Lock specific system utilities from general user scans. Useful during target systems updates.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {Object.entries(toolsState).map(([toolId, enabled]) => (
                  <div key={toolId} className="flex items-center justify-between bg-black/40 border border-cyber-border p-3.5 rounded-xl text-xs font-mono">
                    <span className="text-white hover:text-cyber-green transition-all">{toolId.toUpperCase()}</span>
                    <button
                      onClick={() => toggleTool(toolId)}
                      className="cursor-pointer text-slate-400 hover:text-white transition-colors"
                    >
                      {enabled ? (
                        <div className="flex items-center gap-1.5 text-cyber-green">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-[10px] font-bold">ONLINE</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-400">
                          <ShieldAlert className="h-4 w-4" />
                          <span className="text-[10px] font-bold">LOCKED</span>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Users registered list */}
            <div className="rounded-2xl border border-cyber-border bg-cyber-card/40 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-slate-200 flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-cyber-cyan" />
                AUTHORIZED WHITE-HAT DB RECORDS ({users.length})
              </h3>
              
              <div className="border border-cyber-border rounded-xl overflow-hidden">
                <div className="max-h-60 overflow-y-auto cyber-scroll">
                  <table className="w-full border-collapse text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-cyber-border bg-cyber-gray text-slate-400 text-[10px]">
                        <th className="p-3">USERNAME</th>
                        <th className="p-3">ROLE_CLASS</th>
                        <th className="p-3">ENROLLED STAMP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-border text-slate-300">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-cyber-gray/20">
                          <td className="p-3 font-semibold text-white">{u.username}</td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              u.role === "admin" ? "bg-red-950/40 text-red-400" : "bg-cyber-green/10 text-cyber-green"
                            }`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-[10px] text-slate-500">{new Date(u.registeredAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* REAL TIME LOGS & VIRTUAL FIREWALL SANDBOX - Grid span 5 */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Live Firewall Simulator */}
            <div className="rounded-2xl border border-cyber-border bg-cyber-card/60 p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-500/5 blur-3xl"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-cyber-green" />
                    <span className="font-display text-sm font-bold text-white tracking-wide">SHIELD FIREWALL SANDBOX</span>
                  </div>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                    fwStatus === "PASSIVE" ? "bg-slate-800 text-slate-400" : fwStatus === "MITIGATING" ? "bg-yellow-500/10 text-yellow-400 animate-pulse" : "bg-cyber-green/10 text-cyber-green"
                  }`}>
                    {fwStatus}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fwIpInput}
                    onChange={(e) => setFwIpInput(e.target.value)}
                    placeholder="198.51.100.42"
                    className="flex-1 rounded-xl border border-cyber-border bg-cyber-dark px-3 py-2 font-mono text-[11px] text-white focus:border-red-500/30 outline-none"
                  />
                  <button
                    onClick={triggerFirewallAudit}
                    disabled={fwStatus === "MITIGATING"}
                    className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono text-[10px] px-3.5 py-2 font-bold cursor-pointer transition-all uppercase"
                  >
                    TEST_ATTACK
                  </button>
                </div>

                {/* Firewall simulation logs screen */}
                <div className="bg-black border border-cyber-border p-3.5 rounded-xl text-[10px] font-mono max-h-36 overflow-y-auto space-y-1 cyber-scroll">
                  {fwLogs.map((log, idx) => (
                    <div key={idx} className={log.includes("ATTACK") || log.includes("Suspicious") ? "text-red-400" : log.includes("SUCCESSFUL") || log.includes("Mitigation") ? "text-cyber-green font-bold" : "text-slate-400"}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Auditing Transaction list */}
            <div className="rounded-2xl border border-cyber-border bg-black p-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-cyber-green" />
                  PLATFORM_ACTION_AUDITING_LOGS
                </span>
                <button
                  onClick={clearAllLogs}
                  className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Purge transaction records"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto cyber-scroll space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="border-b border-cyber-border/40 pb-2 text-[10px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-cyber-green font-semibold">[{log.toolName}]</span>
                      <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-300">
                      Target: <span className="text-cyber-cyan">{log.target}</span> - User: <span className="text-white">{log.username}</span>
                    </div>
                    {log.details && (
                      <p className="text-slate-500 leading-normal bg-cyber-gray/30 p-2 rounded mt-1">{log.details}</p>
                    )}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="py-12 text-center text-slate-500 font-mono text-[10px]">
                    [+] Audit buffer empty. Triggers are secure.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
