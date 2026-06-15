import React from "react";
import { 
  Globe, 
  Search, 
  Terminal, 
  Play, 
  MapPin, 
  RefreshCw, 
  AlertTriangle,
  Fingerprint
} from "lucide-react";
import { User, ActivityLog } from "../types";

interface NetworkToolsWidgetProps {
  currentUser: User | null;
  selectedSubTool?: string;
}

export default function NetworkToolsWidget({ currentUser, selectedSubTool }: NetworkToolsWidgetProps) {
  const [activeTab, setActiveTab] = React.useState<"dns" | "whois" | "geoip" | "ports">(
    (selectedSubTool as any) || "dns"
  );

  React.useEffect(() => {
    if (selectedSubTool) {
      setActiveTab(selectedSubTool as any);
    }
  }, [selectedSubTool]);

  // Target Input
  const [target, setTarget] = React.useState("google.com");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Results
  const [dnsResult, setDnsResult] = React.useState<any>(null);
  const [whoisResult, setWhoisResult] = React.useState<any>(null);
  const [geoResult, setGeoResult] = React.useState<any>(null);
  
  // Port scanner specific results
  const [portResult, setPortResult] = React.useState<any[]>([]);
  const [scanLogs, setScanLogs] = React.useState<string[]>([]);

  const handleTabChange = (tab: "dns" | "whois" | "geoip" | "ports") => {
    setActiveTab(tab);
    setError(null);
    if (tab === "ports") setTarget("127.0.0.1");
    else if (tab === "geoip") setTarget("8.8.8.8");
    else setTarget("google.com");
  };

  // Run DNS lookup
  const runDnsLookup = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setDnsResult(null);
    try {
      const res = await fetch("/api/tools/dns-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, user: currentUser?.username || "Anonymous" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resolve DNS records");
      setDnsResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run Whois lookup
  const runWhoisLookup = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setWhoisResult(null);
    try {
      const res = await fetch("/api/tools/whois-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, user: currentUser?.username || "Anonymous" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed WHOIS query");
      setWhoisResult(data.whois);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run IP Geo
  const runGeoLookup = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setGeoResult(null);
    try {
      const res = await fetch("/api/tools/ip-geolocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, user: currentUser?.username || "Anonymous" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IP lookup request failed");
      setGeoResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run Port scanner simulation with real status fetch
  const runPortScanner = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setPortResult([]);
    setScanLogs([`[+] Initializing secure port mapper on ${target}...`]);

    const addLogDeferred = (text: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setScanLogs(prev => [...prev, text]);
          resolve();
        }, delay);
      });
    };

    try {
      await addLogDeferred(`[+] Loading TCP/UDP diagnostic handshake sockets...`, 400);
      await addLogDeferred(`[*] Scanning popular server nodes (21, 22, 25, 53, 80, 443, 3306, 8080)...`, 500);

      const res = await fetch("/api/tools/port-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, user: currentUser?.username || "Anonymous" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Port scanner error occurred");

      await addLogDeferred(`[+] Scanning complete. Analyzing open ports...`, 600);
      setPortResult(data.ports);
      setScanLogs(prev => [...prev, `[+] DISCOVERED ${data.ports.filter((p: any) => p.status === "open").length} OPEN CHANNELS.`]);
    } catch (err: any) {
      setError(err.message);
      setScanLogs(prev => [...prev, `[!] SCAN_ERROR: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const executeCurrentTool = () => {
    if (activeTab === "dns") runDnsLookup();
    else if (activeTab === "whois") runWhoisLookup();
    else if (activeTab === "geoip") runGeoLookup();
    else runPortScanner();
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-cyber-green" />
            NETWORK_ANALYSIS_TOOLS
          </h1>
          <p className="text-sm text-slate-400">Perform real-time DNS records analysis, WHOIS tracing, geolocational IP mapping, and port mapping audits.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 bg-cyber-gray border border-cyber-border rounded-xl p-1.5">
        {[
          { id: "dns", label: "DNS Lookup" },
          { id: "whois", label: "Whois Domain Tracer" },
          { id: "geoip", label: "IP Geolocation" },
          { id: "ports", label: "Security Port Scanner" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`
              rounded-lg py-2 text-xs font-mono tracking-wider transition-all cursor-pointer
              ${activeTab === tab.id 
                ? "bg-cyber-green text-cyber-dark font-bold shadow-[0_0_12px_rgba(0,255,136,0.25)]" 
                : "text-slate-400 hover:bg-cyber-dark/40 hover:text-white"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Terminal Input Card */}
      <div className="rounded-2xl border border-cyber-border bg-cyber-card/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">
              TARGET_HOST / IP_ADDRESS
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-cyber-green">
                root@anmuna:~$
              </span>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={activeTab === "ports" ? "127.0.0.1" : activeTab === "geoip" ? "8.8.8.8" : "google.com"}
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark py-3 pl-28 pr-4 font-mono text-xs text-white focus:border-cyber-green focus:ring-1 focus:ring-cyber-green outline-none"
                onKeyDown={(e) => e.key === "Enter" && executeCurrentTool()}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={executeCurrentTool}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark px-6 py-3 font-display font-bold text-xs tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.15)]"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-cyber-dark" />
              )}
              {loading ? "INITIAL_PROBE..." : "EXECUTE_PROBE"}
            </button>
          </div>
        </div>

        {/* Action Error info message */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-mono text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>[ERROR]: {error}</span>
          </div>
        )}
      </div>

      {/* Results Terminal Block */}
      <div className="rounded-2xl border border-cyber-border bg-black p-6 font-mono text-xs select-text overflow-hidden">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyber-green" />
            <span className="text-slate-300 font-semibold tracking-wide uppercase text-[10px]">ANMUNA COMPLIANT RESPONSE DESK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
            <span className="h-2 w-2 rounded-full bg-cyber-green"></span>
          </div>
        </div>

        {loading && activeTab !== "ports" && (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 text-cyber-green animate-spin" />
            <span className="text-cyber-green tracking-wider uppercase text-[10px] animate-pulse">Resolving target record arrays...</span>
          </div>
        )}

        {!loading && !dnsResult && !whoisResult && !geoResult && portResult.length === 0 && scanLogs.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            [+] Enter target above and execute path query to analyze logs.
          </div>
        )}

        {/* DNS RESULT DISPLAY */}
        {dnsResult && activeTab === "dns" && (
          <div className="space-y-4">
            <div className="text-cyber-green font-semibold">
              DNS SCAN REPORT FOR {dnsResult.target.toUpperCase()}
            </div>
            <div className="border border-cyber-border rounded-xl spill-x overflow-auto cyber-scroll max-h-96">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-cyber-border bg-cyber-gray text-slate-400 uppercase text-[9px]">
                    <th className="p-3">TYPE</th>
                    <th className="p-3">TTL</th>
                    <th className="p-3">VALUE / RESOLUTION DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border">
                  {dnsResult.records && dnsResult.records.map((record: any, idx: number) => {
                    const rType = record.type || "A";
                    let val = "";
                    if (typeof record === "string") val = record;
                    else if (record.address) val = record.address;
                    else if (record.exchange) val = `[MX] ${record.exchange} (Priority: ${record.priority || "0"})`;
                    else if (record.value) val = record.value;
                    else val = JSON.stringify(record);

                    return (
                      <tr key={idx} className="hover:bg-cyber-gray/20">
                        <td className="p-3"><span className="font-bold text-cyber-cyan">{rType}</span></td>
                        <td className="p-3 text-slate-500">300</td>
                        <td className="p-3 text-slate-300 break-all">{val}</td>
                      </tr>
                    );
                  })}
                  {(!dnsResult.records || dnsResult.records.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-3 text-center text-slate-500">No active nameserver maps resolved.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WHOIS RESULT DISPLAY */}
        {whoisResult && activeTab === "whois" && (
          <div className="space-y-4">
            <div className="text-cyber-cyan font-bold flex items-center gap-1.5 border-b border-cyber-border pb-2">
              <Fingerprint className="h-4 w-4" />
              REGISTRATION WHOIS SCHEMATICS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div className="space-y-2 bg-cyber-gray/30 p-4 border border-cyber-border rounded-xl">
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">DOMAIN NAME</span>
                  <span className="text-white font-mono text-sm">{whoisResult.domainName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">REGISTRAR</span>
                  <span className="text-cyber-green">{whoisResult.registrar}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">REGISTRY ID</span>
                  <span className="text-slate-400">{whoisResult.registryDomainId}</span>
                </div>
              </div>

              <div className="space-y-2 bg-cyber-gray/30 p-4 border border-cyber-border rounded-xl">
                <div>
                  <span className="text-slate-500 block text-[10px]">CREATION STAMP</span>
                  <span className="text-slate-300">{new Date(whoisResult.creationDate).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">EXPIRATION STAMP</span>
                  <span className="text-slate-300">{new Date(whoisResult.expirationDate).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ABUSE CONTACT</span>
                  <span className="text-red-400">{whoisResult.abuseContactEmail}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] mb-1.5">RESOLVED ACTIVE NAMESERVERS</span>
              <div className="flex flex-wrap gap-2">
                {whoisResult.nameServers.map((ns: string, idx: number) => (
                  <span key={idx} className="rounded bg-cyber-gray border border-cyber-border px-3 py-1 text-slate-300 font-mono">
                    {ns}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GEOIP IP RESULT DISPLAY */}
        {geoResult && activeTab === "geoip" && (
          <div className="space-y-4">
            <div className="text-cyber-green font-bold">
              RESOLVED POSITIONING RECORD ({geoResult.ip})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-cyber-gray/35 p-4 border border-cyber-border rounded-xl">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-cyber-cyan mt-1" />
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Country & City Location</span>
                    <span className="text-white text-sm font-semibold">{geoResult.data.city}, {geoResult.data.regionName} ({geoResult.data.countryCode})</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">ISP Provider</span>
                  <span className="text-cyber-cyan">{geoResult.data.isp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">ASN Routing</span>
                  <span className="text-slate-400">{geoResult.data.as || "AS9008 Range System"}</span>
                </div>
              </div>

              {/* Graphic Mock Coordinates mapping */}
              <div className="bg-cyber-gray border border-cyber-border rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 cyber-grid"></div>
                <div className="relative font-mono text-[10px] space-y-1.5 text-slate-400">
                  <div className="text-cyber-green font-bold">GEODETIC COORDINATES:</div>
                  <div>LATITUDE: <span className="text-white">{geoResult.data.lat}° N</span></div>
                  <div>LONGITUDE: <span className="text-white">{geoResult.data.lon}° E</span></div>
                  <div>TIMEZONE: <span className="text-white">{geoResult.data.timezone}</span></div>
                  <div className="pt-2 flex items-center gap-1.5 text-[9px] text-cyber-cyan font-bold">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-ping"></span>
                    LOCK POINT REGISTERED SECURELY
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PORT SCAN LOGS AND RESULT DISPLAY */}
        {activeTab === "ports" && (scanLogs.length > 0 || portResult.length > 0) && (
          <div className="space-y-4">
            <div className="text-cyber-green font-bold flex items-center gap-1.5">
              <Terminal className="h-4 w-4" />
              PORT HANDSHAKE SECURE STATUS STREAM
            </div>

            {/* Scrollable Scanner console logs */}
            <div className="bg-cyber-gray/40 border border-cyber-border p-3 rounded-xl max-h-40 overflow-y-auto space-y-1 text-[10px]">
              {scanLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith("[!]") ? "text-red-400" : log.startsWith("[+]") ? "text-cyber-green font-semibold" : "text-slate-400"}>
                  {log}
                </div>
              ))}
            </div>

            {/* Ports status table */}
            {portResult.length > 0 && (
              <div className="border border-cyber-border rounded-xl">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-cyber-border bg-cyber-gray/60 text-slate-400 text-[10px]">
                      <th className="p-3">PORT NUMBER</th>
                      <th className="p-3">STANDARD SERVICE</th>
                      <th className="p-3">HANDSHAKE SIGNATURE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-border">
                    {portResult.map((p, idx) => (
                      <tr key={idx} className="hover:bg-cyber-gray/20">
                        <td className="p-3 font-semibold text-white">{p.port}</td>
                        <td className="p-3 text-slate-400">{p.service}</td>
                        <td className="p-3">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            p.status === "open" 
                              ? "bg-cyber-green/10 text-cyber-green border border-cyber-green/30" 
                              : "bg-red-950/20 text-red-400/80 border border-red-500/10"
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
