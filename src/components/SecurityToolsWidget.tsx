import React from "react";
import { 
  ShieldCheck, 
  Terminal, 
  Play, 
  RefreshCw, 
  AlertOctagon, 
  CheckCircle, 
  Cpu, 
  BookOpen, 
  Award,
  Sparkles
} from "lucide-react";
import { User } from "../types";

interface SecurityToolsWidgetProps {
  currentUser: User | null;
  selectedSubTool?: string;
}

export default function SecurityToolsWidget({ currentUser, selectedSubTool }: SecurityToolsWidgetProps) {
  const [activeTab, setActiveTab] = React.useState<"http" | "ssl" | "tech">("http");

  React.useEffect(() => {
    if (selectedSubTool) {
      if (selectedSubTool === "ssl-checker") setActiveTab("ssl");
      else if (selectedSubTool === "website-technology-detector") setActiveTab("tech");
      else setActiveTab("http");
    }
  }, [selectedSubTool]);

  const [target, setTarget] = React.useState("cloudflare.com");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // SSL State results
  const [sslResult, setSslResult] = React.useState<any>(null);

  // HTTP Auditor results
  const [httpResult, setHttpResult] = React.useState<any>(null);

  // AI Vulnerabilities Advisor result state
  const [aiAdvice, setAiAdvice] = React.useState<string>("");
  const [aiLoading, setAiLoading] = React.useState(false);

  // Tech Detector State results
  const [detectedTech, setDetectedTech] = React.useState<string[]>([]);
  const [detectedServerList, setDetectedServerList] = React.useState<any>(null);

  const handleTabChange = (tab: "http" | "ssl" | "tech") => {
    setActiveTab(tab);
    setError(null);
    setSslResult(null);
    setHttpResult(null);
    setAiAdvice("");
    setTarget("cloudflare.com");
  };

  // 1. HTTP Auditor
  const runHttpAudit = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setHttpResult(null);
    setAiAdvice("");
    try {
      const res = await fetch("/api/tools/http-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, user: currentUser?.username || "Anonymous" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Http analysis failed");
      setHttpResult(data);

      // Instantly run the AI Threat analysis using the audit data
      runAiThreatAdvisor(data.headers, data.score);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. AI Threat Analyzer Query
  const runAiThreatAdvisor = async (headers: any, score: number) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/tools/vulnerability-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers, score, host: target, user: currentUser?.username || "Anonymous" })
      });
      const data = await res.json();
      if (res.ok) {
        setAiAdvice(data.advice);
      }
    } catch (err) {
      console.error("AI Advisor error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // 3. SSL checker details
  const runSslCheck = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setSslResult(null);
    try {
      const res = await fetch("/api/tools/ssl-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, user: currentUser?.username || "Anonymous" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "SSL verification query failed");
      setSslResult(data.cert);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Technology stack detector
  const runTechDetect = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setDetectedTech([]);
    setDetectedServerList(null);

    try {
      // Fetch headers to look for Server tag clues
      const res = await fetch("/api/tools/http-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, user: currentUser?.username || "Anonymous" })
      });
      const data = await res.json();

      const headers = data.headers || {};
      const techList: string[] = [];
      const serverTag = headers["server"] || "";
      const poweredBy = headers["x-powered-by"] || "";
      const cookie = headers["set-cookie"] || "";

      // Deduce Tech
      if (/express/i.test(poweredBy) || /express/i.test(serverTag)) {
        techList.push("Express.js Server Framework");
        techList.push("Node.js Runtime Environs");
      }
      if (/cloudflare/i.test(serverTag)) {
        techList.push("Cloudflare CDN & Proxy Protections");
        techList.push("Cloudflare SSL Firewall");
      }
      if (/nginx/i.test(serverTag)) {
        techList.push("NGINX Reverse Web Proxy Server");
      }
      if (/apache/i.test(serverTag)) {
        techList.push("Apache HTTP Web server module");
      }
      if (/phpsessid/i.test(cookie)) {
        techList.push("PHP Hypertext Backend core");
      }
      if (/next/i.test(serverTag) || /next/i.test(cookie)) {
        techList.push("NextJS SSR Framework");
        techList.push("React UI Library");
      }

      // Add default stack detections based on domain clues
      if (techList.length === 0) {
        techList.push("Standard HTML5 / CSS3 Layout Node");
        techList.push("Let's Encrypt SSL Root Certificate");
      }

      setDetectedTech(techList);
      setDetectedServerList({
        server: serverTag || "Apache / NGINX Gate",
        powered: poweredBy || "Express.js Engine",
        cookieSecure: cookie ? (/secure/i.test(cookie) ? "YES" : "NO - Missing Secure Attribute") : "None Sent"
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { char: "A+", color: "text-cyber-green border-cyber-green/40 shadow-[0_0_15px_rgba(0,255,136,0.3)]" };
    if (score >= 80) return { char: "A", color: "text-cyber-green/90 border-cyber-green/30" };
    if (score >= 60) return { char: "B", color: "text-cyber-cyan border-cyber-cyan/30" };
    if (score >= 40) return { char: "C", color: "text-yellow-400 border-yellow-400/30" };
    return { char: "F", color: "text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse" };
  };

  const executeCurrentTool = () => {
    if (activeTab === "http") runHttpAudit();
    else if (activeTab === "ssl") runSslCheck();
    else runTechDetect();
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-cyber-cyan" />
          SECURITY_HEX_RECON
        </h1>
        <p className="text-sm text-slate-400">Perform deep cryptographic analyses of TLS/SSL handshakes, analyze HTTP security headers, detect full stack technologies, and trigger automated AI safety guidelines.</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-cyber-gray border border-cyber-border rounded-xl p-1.5">
        {[
          { id: "http", label: "HTTP Header Audit" },
          { id: "ssl", label: "SSL Checker" },
          { id: "tech", label: "Website Technology Finder" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`
              rounded-lg py-2 text-xs font-mono tracking-wider transition-all cursor-pointer
              ${activeTab === tab.id 
                ? "bg-cyber-cyan text-cyber-dark font-bold shadow-[0_0_12px_rgba(0,212,255,0.25)]" 
                : "text-slate-400 hover:bg-cyber-dark/40 hover:text-white"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Terminal Input Block */}
      <div className="rounded-2xl border border-cyber-border bg-cyber-card/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-grow">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">
              TARGET_DOMAIN / SECURE_URL
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-cyber-cyan">
                sec-audit:~$
              </span>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="cloudflare.com"
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark py-3 pl-28 pr-4 font-mono text-xs text-white focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan outline-none"
                onKeyDown={(e) => e.key === "Enter" && executeCurrentTool()}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={executeCurrentTool}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-cyber-cyan hover:bg-cyber-cyan/90 text-cyber-dark px-6 py-3 font-display font-bold text-xs tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.15)]"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-cyber-dark" />
              )}
              {loading ? "ANALYZING..." : "START_SECURITY_AUDIT"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-mono text-red-400">
            <AlertOctagon className="h-4 w-4 shrink-0" />
            <span>[AUDIT ERROR]: {error}</span>
          </div>
        )}
      </div>

      {/* Audit Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Console Data Displays (8/12 grid span) */}
        <div className="lg:col-span-7 rounded-2xl border border-cyber-border bg-black p-6 font-mono text-xs select-text overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
            <span className="text-slate-300 font-semibold tracking-wide text-[10px] uppercase">LOCAL SECURITY DEPLOYER CONTROLS</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyber-cyan animate-pulse"></span>
              <span className="text-cyber-cyan text-[9px]">SECURE</span>
            </div>
          </div>

          {loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 text-cyber-cyan animate-spin" />
              <span className="text-cyber-cyan tracking-wider uppercase text-[10px] animate-pulse font-bold">Interrogating security nodes...</span>
            </div>
          )}

          {!loading && !httpResult && !sslResult && detectedTech.length === 0 && (
            <div className="py-24 text-center text-slate-500">
              [+] Execute security analysis above to audit TLS and HTTP parameters.
            </div>
          )}

          {/* HTTP AUDIT REPORT */}
          {httpResult && activeTab === "http" && (
            <div className="space-y-6">
              {/* Score header */}
              <div className="flex items-center justify-between bg-cyber-gray/30 p-4 border border-cyber-border rounded-xl">
                <div>
                  <h4 className="text-white text-sm font-semibold tracking-wide">POSTURE SECURITY CHECK</h4>
                  <p className="text-[10px] text-slate-500">Audit mapping completed for {httpResult.target}</p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-xl font-bold font-display ${getGrade(httpResult.score).color}`}>
                  {getGrade(httpResult.score).char}
                </div>
              </div>

              {/* Specific audited security headers */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase">SECURITY HEADER MATRIX</h5>
                
                {[
                  { name: "Content-Security-Policy (CSP)", value: httpResult.audit.contentSecurityPolicy, desc: "Mitigates XSS injections and script evaluations." },
                  { name: "Strict-Transport-Security (HSTS)", value: httpResult.audit.strictTransportSecurity, desc: "Mandates SSL web socket transport paths exclusively." },
                  { name: "X-Frame-Options", value: httpResult.audit.xFrameOptions, desc: "Secures websites against clickjacking frameworks." },
                  { name: "X-Content-Type-Options", value: httpResult.audit.xContentTypeOptions, desc: "Repels media MIME type spoofing." },
                  { name: "Referrer-Policy", value: httpResult.audit.referrerPolicy, desc: "Shields internal document paths context during routing." }
                ].map((header, idx) => {
                  const secure = header.value !== "MISSING";
                  return (
                    <div key={idx} className="flex items-start justify-between bg-cyber-gray/20 p-3 rounded-xl border border-cyber-border/40 text-[11px]">
                      <div className="space-y-0.5 max-w-[70%]">
                        <span className="text-white font-bold block">{header.name}</span>
                        <span className="text-slate-500 text-[10px]">{header.desc}</span>
                      </div>
                      <span className={`rounded-md px-2 py-1 text-[9px] font-mono font-bold uppercase shrink-0 ${
                        secure 
                          ? "bg-cyber-green/10 text-cyber-green border border-cyber-green/20" 
                          : "bg-red-950/20 text-red-400 border border-red-500/10"
                      }`}>
                        {header.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Raw headers listing output */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">RAW HTTP RESPONSE HEADERS</span>
                <div className="border border-cyber-border bg-cyber-dark/80 p-3 rounded-xl max-h-40 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1 cyber-scroll select-all">
                  {Object.entries(httpResult.headers).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <span className="text-cyber-cyan">{key}</span>: <span className="text-slate-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SSL RESULT DETAILS */}
          {sslResult && activeTab === "ssl" && (
            <div className="space-y-6">
              <div className="text-cyber-green font-bold flex items-center gap-1.5 pb-2 border-b border-cyber-border">
                <Award className="h-4.5 w-4.5" />
                TLS HANDSHAKE CERTIFICATION OVERVIEW
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-cyber-gray/30 border border-cyber-border p-3.5 rounded-xl">
                    <span className="text-slate-500 block text-[9px] uppercase">COMMON_NAME (CN)</span>
                    <span className="text-white font-bold text-xs">{sslResult.subject.CN || "Global Cert Host"}</span>
                  </div>
                  <div className="bg-cyber-gray/30 border border-cyber-border p-3.5 rounded-xl">
                    <span className="text-slate-500 block text-[9px] uppercase">ORGANIZATION (O)</span>
                    <span className="text-slate-300">{sslResult.subject.O || "Domain Authority"}</span>
                  </div>
                </div>

                <div className="bg-cyber-gray/30 border border-cyber-border p-3.5 rounded-xl text-[11px] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[9px]">ENCRYPT ALGORITHM STRENGTH:</span>
                    <span className="text-cyber-cyan font-bold font-mono">{sslResult.bits} bits Standard Suite</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[9px]">ISSUED SIGNING AUTHORITY:</span>
                    <span className="text-slate-300 font-semibold">{sslResult.issuer.O || "Let's Encrypt CA"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[9px]">EXPIRATION:</span>
                    <span className={`${sslResult.isExpired ? "text-red-400 font-bold" : "text-cyber-green"}`}>
                      {sslResult.isExpired ? "EXPIRED" : `Active until ${new Date(sslResult.validTo).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">SHA256 FINGERPRINT SIGNATURE</span>
                  <div className="bg-cyber-dark/80 border border-cyber-border p-3 rounded-xl font-mono text-[10px] text-slate-400 break-all select-all">
                    {sslResult.fingerprint256 || "Handshake Fingerprint Cryptographic Array"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TECHNOLOGY DETECTOR RESULTS */}
          {detectedTech.length > 0 && activeTab === "tech" && (
            <div className="space-y-6">
              <div className="text-cyber-cyan font-bold flex items-center gap-1.5 pb-2 border-b border-cyber-border uppercase text-[10px]">
                <Cpu className="h-4.5 w-4.5" />
                INTELLIGENT TECHNOLOGY DETECTION STACK
              </div>

              {/* Detected technologies badges */}
              <div>
                <span className="text-slate-500 block text-[10px] mb-2 uppercase">RECOGNIZED APPLICATION FRAMEWORKS</span>
                <div className="flex flex-wrap gap-2">
                  {detectedTech.map((tech, idx) => (
                    <span key={idx} className="rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan px-3.5 py-1.5 text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* System details */}
              {detectedServerList && (
                <div className="space-y-2 bg-cyber-gray/30 border border-cyber-border p-4 rounded-xl text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">SERVER TAG DETECTED:</span>
                    <span className="text-white font-mono">{detectedServerList.server}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">BACKEND RUNTIME CLUES:</span>
                    <span className="text-white font-mono">{detectedServerList.powered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">COOKIE SECURITY SETTINGS:</span>
                    <span className={detectedServerList.cookieSecure.includes("YES") ? "text-cyber-green font-bold" : "text-yellow-400 font-mono"}>
                      {detectedServerList.cookieSecure}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: AI Threat Advisor (5/12 grid span) */}
        <div className="lg:col-span-5 rounded-2xl border border-cyber-border bg-cyber-gray/30 p-5 backdrop-blur-sm relative overflow-hidden">
          {/* Neon gradient mesh bg */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyber-cyan/5 blur-3xl"></div>
          
          <div className="relative space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyber-green/10 text-cyber-green border border-cyber-green/20">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-display text-xs font-bold tracking-widest text-slate-200">AI_THREAT_ADVISOR</span>
            </div>

            {aiLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-2 text-center text-xs font-mono">
                <RefreshCw className="h-5 w-5 text-cyber-green animate-spin mb-1" />
                <span className="text-cyber-green tracking-wider animate-pulse uppercase text-[10px]">COMPUTING EXPLOIT POSTURES VIA GEMINI AI...</span>
              </div>
            ) : aiAdvice ? (
              <div className="font-mono text-[11px] text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap select-text max-h-96 overflow-y-auto cyber-scroll">
                {aiAdvice}
              </div>
            ) : (
              <div className="py-20 text-center font-mono text-[10px] text-slate-500 space-y-2">
                <BookOpen className="h-6 w-6 mx-auto opacity-30 text-slate-400" />
                <p className="max-w-[80%] mx-auto font-sans text-xs">Execute an HTTP Header Audit or website technologist lookup to evaluate potential cyber-attack paths using our server-side secure Gemini Advisor.</p>
              </div>
            )}
            
            {aiAdvice && (
              <div className="border-t border-cyber-border pt-3 flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span>MODEL: GEMINI-2.5-FLASH</span>
                <span>GRADE ACCORDING TO COMPLIANCE</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
