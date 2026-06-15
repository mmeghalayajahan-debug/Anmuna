import React from "react";
import { 
  Binary, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw, 
  HelpCircle, 
  Key, 
  CheckCircle,
  Hash
} from "lucide-react";

export default function HashToolsWidget() {
  const [activeTab, setActiveTab] = React.useState<"hash" | "decoder" | "base64" | "password">("hash");

  // State handles
  const [inputText, setInputText] = React.useState("Anmuna_Secure_String_2026");
  const [hashAlgorithm, setHashAlgorithm] = React.useState<"SHA-256" | "SHA-1">("SHA-256");
  const [hashOutput, setHashOutput] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // Hash Decoder
  const [decodeInput, setDecodeInput] = React.useState("5cb6fc7b966cf15be2bd36531fc4847e098485ddfcfff110197022f4625b11cf");
  const [decodeOutput, setDecodeOutput] = React.useState<string | null>(null);

  // Base64
  const [b64Input, setB64Input] = React.useState("SGFja2VycyBhcmUgd2VsY29tZSBvbiBBbm11bmEgU2VydmVyIQ==");
  const [b64Output, setB64Output] = React.useState("");
  const [b64Mode, setB64Mode] = React.useState<"encode" | "decode">("decode");

  // Password Generator
  const [passLength, setPassLength] = React.useState(16);
  const [useUpper, setUseUpper] = React.useState(true);
  const [useLower, setUseLower] = React.useState(true);
  const [useNums, setUseNums] = React.useState(true);
  const [useSymbols, setUseSymbols] = React.useState(true);
  const [generatedPass, setGeneratedPass] = React.useState("");

  // Copy helper
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate Hash dynamically using WebCrypto SubtleCrypto (Very clean & native React 19 support)
  const generateHash = React.useCallback(async () => {
    if (!inputText) {
      setHashOutput("");
      return;
    }
    try {
      const msgUint8 = new TextEncoder().encode(inputText);
      const hashBuffer = await crypto.subtle.digest(hashAlgorithm, msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      setHashOutput(hashHex);
    } catch (err) {
      console.error(err);
      setHashOutput("Cryptographic SubtleCrypto error.");
    }
  }, [inputText, hashAlgorithm]);

  React.useEffect(() => {
    generateHash();
  }, [generateHash]);

  // Decode lookup (Common security lists)
  const runDecoderLookup = () => {
    const commonRainbowDb: Record<string, string> = {
      // sha256 common hashes
      "5cb6fc7b966cf15be2bd36531fc4847e098485ddfcfff110197022f4625b11cf": "anmuna_server",
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8": "password",
      "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918": "admin",
      "fb8e20fc2e4c3f248c60c39bd652f4c172ac244b02d84d50c6095568586ea556": "123456",
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824": "hello",
      "098f6bcd4621d373cade4e832627b4f6": "test"
    };

    const cleanInput = decodeInput.trim().toLowerCase();
    const match = commonRainbowDb[cleanInput];
    if (match) {
      setDecodeOutput(`[+] HASH REVERSED SUCCESSFULLY!
-------------------------------------------
HASH: ${cleanInput}
REVERSED VALUE: "${match}"
MATCH QUALITY: 100% (Static Rainbow Dictionary)`);
    } else {
      setDecodeOutput(`[-] HASH REVERSAL FAILED
-------------------------------------------
Input hash was not found in Anmuna standard lookup lists. 
For production decoders, secure salts prevent database lookup matches.`);
    }
  };

  // Base64 actions
  const runBase64 = () => {
    try {
      if (b64Mode === "encode") {
        setB64Output(btoa(b64Input));
      } else {
        setB64Output(atob(b64Input));
      }
    } catch (err: any) {
      setB64Output(`Base64 decode failure: Invalid format string.`);
    }
  };

  React.useEffect(() => {
    runBase64();
  }, [b64Input, b64Mode]);

  // Password generator
  const runPasswordGenerator = () => {
    const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowers = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let pool = "";
    if (useUpper) pool += uppers;
    if (useLower) pool += lowers;
    if (useNums) pool += numbers;
    if (useSymbols) pool += symbols;

    if (!pool) {
      setGeneratedPass("Select at least one input pool.");
      return;
    }

    let pass = "";
    const array = new Uint32Array(passLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
        pass += pool[array[i] % pool.length];
    }
    setGeneratedPass(pass);
  };

  React.useEffect(() => {
    runPasswordGenerator();
  }, [passLength, useUpper, useLower, useNums, useSymbols]);

  const passwordStrength = () => {
    if (generatedPass.length < 10) return { label: "WEAK", color: "text-red-400 bg-red-950/25 border-red-500/20" };
    if (generatedPass.length < 14) return { label: "MEDIUM Strength", color: "text-yellow-400 bg-yellow-950/25 border-yellow-400/20" };
    return { label: "CRYPTOGRAPHICALLY SECURE", color: "text-cyber-green bg-cyber-green/10 border-cyber-green/20" };
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Binary className="h-6 w-6 text-cyber-green" />
          CYBER_UTILITY_SUITE
        </h1>
        <p className="text-sm text-slate-400">Essential offline toolkit for secure encryption hashing, decryption dictionary lookups, Base64 translations, and high-entropy key generators.</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 bg-cyber-gray border border-cyber-border rounded-xl p-1.5">
        {[
          { id: "hash", label: "Hash Encrypter" },
          { id: "decoder", label: "Hash Decoder List" },
          { id: "base64", label: "Base64 Encoder/Decoder" },
          { id: "password", label: "Secure Key Generator" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      {/* HASH ENCRYPTER PANEL */}
      {activeTab === "hash" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/40 p-6 space-y-4">
            <h3 className="font-display text-sm font-semibold text-slate-200">INPUT SOURCE DATA</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">ALGORITHM</label>
                <select
                  value={hashAlgorithm}
                  onChange={(e) => setHashAlgorithm(e.target.value as any)}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-dark px-4 py-2.5 font-mono text-xs text-white focus:border-cyber-green outline-none"
                >
                  <option value="SHA-256">SHA-256 (High Defense Standard)</option>
                  <option value="SHA-1">SHA-1 (Legacy Integrity)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">RAW STRING</label>
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-dark p-4 font-mono text-xs text-white focus:border-cyber-green outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyber-border bg-black p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-cyber-green" />
                  HASH digest Output
                </span>
                <span className="text-[9px] font-mono bg-cyber-green/5 text-cyber-green border border-cyber-green/10 rounded px-1.5 py-0.5">COMPLETED</span>
              </div>
              <div className="font-mono text-xs text-slate-300 bg-cyber-gray/30 rounded-xl p-4 border border-cyber-border break-all min-h-24 font-semibold leading-relaxed tracking-wider">
                {hashOutput}
              </div>
            </div>

            <button
              onClick={() => handleCopy(hashOutput)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-display font-bold text-xs py-2.5 w-full transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,136,0.15)]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "COPIED_TO_CLIPBOARD" : "COPY_HASH_DIGEST"}
            </button>
          </div>
        </div>
      )}

      {/* HASH DECODER RESURFACING PANEL */}
      {activeTab === "decoder" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/40 p-6 space-y-4">
            <h3 className="font-display text-sm font-semibold text-slate-200 uppercase">Rainbow Dictionary Lookup</h3>
            <p className="text-[11px] text-slate-400">Checks input hex hash signatures against standard common dictionary lists.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">TARGET HASH SIGNATURE</label>
                <input
                  type="text"
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-dark px-4 py-3 font-mono text-xs text-white focus:border-cyber-green outline-none"
                />
              </div>
              <button
                onClick={runDecoderLookup}
                className="w-full rounded-xl bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-display font-bold text-xs py-2.5 transition-all text-center cursor-pointer shadow-[0_0_12px_rgba(0,255,136,0.15)]"
              >
                EXECUTE DATABASE LOOKUP
              </button>
            </div>
            
            <div className="col-span-2">
              <span className="font-bold text-slate-500 text-[10px] font-mono uppercase block mb-1">POPULAR SYSTEM TEST CHECKS:</span>
              <div className="font-mono text-[9px] text-slate-400 space-y-1">
                <div>anmuna_server: <span className="text-cyber-green">5cb6fc7b966cf15be2bd36531fc4847e098485ddfcfff110197022f4625b11cf</span></div>
                <div>password (SHA256): <span className="text-cyber-cyan">5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyber-border bg-black p-6 font-mono text-xs text-slate-300 min-h-48 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 border-b border-cyber-border pb-3 mb-4">
                <Terminal className="h-4 w-4 text-cyber-green" />
                <span className="text-slate-400 text-[10px] uppercase font-semibold">DECODER DATABASE REPORT</span>
              </div>
              <pre className="whitespace-pre-wrap select-text font-mono text-[11px] leading-relaxed">
                {decodeOutput || "[+] Awaiting instruction lookup..."}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* BASE64 ENCODER/DECODER */}
      {activeTab === "base64" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-slate-200">BASE64 TRANSLATION</h3>
              <div className="flex bg-cyber-dark border border-cyber-border rounded-lg p-0.5">
                <button
                  onClick={() => setB64Mode("encode")}
                  className={`px-3 py-1 text-[10px] rounded-md font-mono cursor-pointer ${b64Mode === "encode" ? "bg-cyber-green text-cyber-dark font-bold" : "text-slate-400"}`}
                >
                  ENCODE
                </button>
                <button
                  onClick={() => setB64Mode("decode")}
                  className={`px-3 py-1 text-[10px] rounded-md font-mono cursor-pointer ${b64Mode === "decode" ? "bg-cyber-green text-cyber-dark font-bold" : "text-slate-400"}`}
                >
                  DECODE
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">SOURCE STRING</label>
              <textarea
                rows={5}
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark p-4 font-mono text-xs text-white focus:border-cyber-green outline-none resize-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-cyber-border bg-black p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">TRANSLATED OUTPUT</span>
                <span className="text-[9px] font-mono text-cyber-green uppercase font-semibold">{b64Mode}D_STR</span>
              </div>
              <div className="font-mono text-xs text-slate-300 bg-cyber-gray/30 rounded-xl p-4 border border-cyber-border min-h-24 select-all break-all whitespace-pre-wrap">
                {b64Output}
              </div>
            </div>

            <button
              onClick={() => handleCopy(b64Output)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-display font-bold text-xs py-2.5 w-full transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,136,0.15)]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "COPIED_TO_CLIPBOARD" : "COPY_TRANSLATOR_OUTPUT"}
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC SECURE PASSWORD GENERATOR */}
      {activeTab === "password" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/40 p-6 space-y-4">
            <h3 className="font-display text-sm font-semibold text-slate-200 flex items-center gap-1.5 uppercase">
              <Key className="h-4 w-4 text-cyber-green" />
              Policy filters
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">CHARACTER LENGTH</span>
                  <span className="text-cyber-green font-bold">{passLength} chars</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={passLength}
                  onChange={(e) => setPassLength(Number(e.target.value))}
                  className="w-full accent-cyber-green"
                />
              </div>

              <div className="space-y-2 text-xs font-mono">
                {[
                  { label: "INCLUDE UPPERCASE LETTERS (A-Z)", state: useUpper, set: setUseUpper },
                  { label: "INCLUDE LOWERCASE LETTERS (a-z)", state: useLower, set: setUseLower },
                  { label: "INCLUDE NUMERICAL SYSTEMS (0-9)", state: useNums, set: setUseNums },
                  { label: "INCLUDE CYBER SYMBOLS (!@#$...)", state: useSymbols, set: setUseSymbols }
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 text-slate-300 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.set(e.target.checked)}
                      className="accent-cyber-green h-4 w-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyber-border bg-black p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">HIGH ENTROPY KEY</span>
                <span className={`rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${passwordStrength().color}`}>
                  {passwordStrength().label}
                </span>
              </div>
              <div className="font-mono text-sm text-center text-cyber-green bg-cyber-gray/30 rounded-xl p-4 border border-cyber-border select-all break-all font-bold tracking-wider min-h-16 flex items-center justify-center">
                {generatedPass}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={runPasswordGenerator}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-cyber-border bg-cyber-gray hover:bg-cyber-gray/80 text-white font-mono text-xs py-2.5 transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                RE_GENERATE
              </button>
              <button
                onClick={() => handleCopy(generatedPass)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-display font-bold text-xs py-2.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,136,0.15)]"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                COPY_KEY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
