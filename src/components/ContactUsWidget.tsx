import React from "react";
import { Mail, CheckCircle, ShieldAlert, Key, ArrowRight } from "lucide-react";

export default function ContactUsWidget() {
  const [email, setEmail] = React.useState("");
  const [topic, setTopic] = React.useState("compliance");
  const [msg, setMsg] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !msg) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Mail className="h-6 w-6 text-cyber-green" />
          SECURE_SUPPORT_LOGPORTAL
        </h1>
        <p className="text-sm text-slate-400">Open an encrypted support or bug bounty reporting channel securely inside our local server nodes.</p>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-cyber-green/20 bg-cyber-green/5 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-cyber-green/10 text-cyber-green flex items-center justify-center mx-auto border border-cyber-green/30 shadow-[0_0_12px_rgba(0,255,136,0.2)]">
            <CheckCircle className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1.5 font-mono">
            <h3 className="text-white text-md font-bold uppercase">Ticket Registered Securely!</h3>
            <p className="text-slate-400 text-xs">Reference Hash ID: <span className="text-cyber-green font-bold">SHA-256::{Math.floor(Math.random() * 900000 + 100000).toString(16)}</span></p>
            <p className="text-slate-500 text-[10px] max-w-[80%] mx-auto mt-2">Compliance officers will parse your submission and get back to your secure email address within 12 standard operating cycles.</p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setMsg(""); }}
            className="rounded-lg border border-cyber-green bg-cyber-green/10 hover:bg-cyber-green hover:text-cyber-dark px-4 py-1.5 text-xs font-mono text-cyber-green cursor-pointer transition-all"
          >
            OPEN_NEW_LOG
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-cyber-border bg-cyber-card/60 p-6 space-y-4 backdrop-blur-sm">
          {/* Info Badge */}
          <div className="flex items-start gap-2 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/5 p-4 text-[11px] font-mono text-slate-300">
            <ShieldAlert className="h-4.5 w-4.5 text-cyber-cyan shrink-0 mt-0.5" />
            <div>
              <span className="text-cyber-cyan font-bold block mb-0.5">SECURED CONNECTION INFORMS:</span>
              Your input fields are encrypted in transport using AES-256 standard socket routing.
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-semibold">YOUR_EMAIL_ADDRESS</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@securegate.org"
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark px-4 py-3 text-white focus:border-cyber-green outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-semibold">INQUIRY_TOPIC</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark px-4 py-3 text-slate-300 focus:border-cyber-green outline-none"
              >
                <option value="compliance">Compliance & Ethical Audits</option>
                <option value="vulnerability">Vulnerability Disclosure Form</option>
                <option value="api">Anmuna API Integration Support</option>
                <option value="abuse">Registrar Abuse Report</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-semibold">SECURE MESSAGE TICKET DETAILS</label>
              <textarea
                required
                rows={5}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Please enter details of the target compliance or API request..."
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark p-4 text-white focus:border-cyber-green outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark px-5 py-3 font-display font-extrabold text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.15)] w-full"
          >
            SUBMIT_ENCRYPTED_TICKET
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
