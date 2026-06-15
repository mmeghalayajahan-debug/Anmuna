import React from "react";
import { Users, Shield, Award, Landmark, CheckCircle } from "lucide-react";

export default function AboutUsWidget() {
  const systems = [
    { label: "DEFENSIVE_AUDITS", stat: "142,504+", desc: "Continuous automated scanning checks completed on client servers." },
    { label: "SUPPORTED_GUILDS", stat: "1,850+", desc: "Certified cyber security researchers registered active in the platform." },
    { label: "EXPLOITS_PATCHED", stat: "99.8%", desc: "Vulnerability matrices assessed and mitigated successfully within minutes." }
  ];

  const experts = [
    { name: "Prof. Jahangir Kabir", role: "Chief Security Officer / Founder", code: "anmuna_root", spec: "Kernel Exploit mitigation, Reverse Engineering, Cryptographic Security Protocol audits." },
    { name: "Elena Rostova", role: "Threat Recon Specialist", code: "cyber_sentinel", spec: "OSINT forensics tracking, DNS / BGP network mapping, passive subdomain profiling." },
    { name: "Devon Sterling", role: "DevSecOps Lead Architect", code: "sterling_shield", spec: "Secure cloud environment deployments, virtual firewalls, automated continuous headers auditing." }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-green/10 text-cyber-green border border-cyber-green/20">
          <Users className="h-5 w-5" />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white uppercase">ANMUNA_SERVER_ETHICAL_MANIFESTO</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">We are an elite guild of certified cyber security experts. Our sole mission is to fortify open source networks against advanced persistent threats using robust defensive utilities.</p>
      </div>

      {/* Cyber Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {systems.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-cyber-border bg-cyber-card/40 p-5 backdrop-blur-sm hover:border-cyber-green/30 transition-all group">
            <span className="font-mono text-[9px] text-slate-500 uppercase block tracking-widest">{item.label}</span>
            <span className="font-display text-2xl font-bold text-cyber-green block mt-1 glow-green">{item.stat}</span>
            <p className="font-sans text-xs text-slate-400 leading-relaxed mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Values & Guidelines Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyber-cyan" />
            ETHICAL USE CHARTER
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            All utilities housed within the Anmuna Server node must be deployed in strictly defensive environments. Any use of port scanning or passive OSINT mappings on systems without clear written authorization violates professional compliance principles.
          </p>
          <div className="space-y-2 font-mono text-[11px] text-slate-300">
            {[
              "Mandatory written alignment from target server officers beforehand.",
              "Strict diagnostic compliance - zero payload injection or disruption of operations.",
              "Defensive remediation focus - sharing audit logs securely with server admins."
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-cyber-cyan shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cyber-border bg-cyber-gray/20 p-6 space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 cyber-grid"></div>
          <h3 className="font-mono text-xs font-bold text-cyber-green uppercase tracking-widest">REGULATORY CREDENTIALS</h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <Landmark className="h-5 w-5 text-cyber-cyan shrink-0" />
              <div>
                <span className="font-bold text-slate-200 block">CREST Certified Hub</span>
                <span className="text-[11px] text-slate-400">Auditing systems follow ISO/IEC 27001 assessment criteria securely.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-cyber-green shrink-0" />
              <div>
                <span className="font-bold text-slate-200 block">PCI-DSS Assessment Node</span>
                <span className="text-[11px] text-slate-400">Assisting merchants in identifying non-compliant HTTP response header postures.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expert roster staff */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-center text-white uppercase tracking-wider">CORE_OPERATIONS_OFFICERS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experts.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-cyber-border bg-cyber-card p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-white leading-none">{item.name}</h4>
                  <span className="text-[10px] text-cyber-cyan font-semibold block mt-1.5">{item.role}</span>
                </div>
              </div>
              <span className="inline-block rounded bg-cyber-gray px-2 py-0.5 font-mono text-[9px] text-slate-400">
                DECRYPT_KEY:: {item.code}
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.spec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
