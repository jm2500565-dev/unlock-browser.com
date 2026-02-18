
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Search, Globe, Shield, Sparkles, Loader2, Copy, ExternalLink, 
  Info, ArrowLeft, RotateCcw, Clock, History, ChevronRight, Cpu, Activity
} from 'lucide-react';

type Provider = 'core' | 'stealth';

interface HistoryItem {
  query: string;
  timestamp: number;
}

const Gateway: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider>('core');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [diagnostic, setDiagnostic] = useState<'idle' | 'testing' | 'success' | 'blocked'>('idle');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nova_gateway_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const runDiagnostic = async () => {
    setDiagnostic('testing');
    try {
      // Test connectivity to a common API endpoint
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models', { mode: 'no-cors' });
      // In no-cors mode, we can't see the content, but if it doesn't throw, the domain is likely reachable
      setDiagnostic('success');
      setTimeout(() => setDiagnostic('idle'), 3000);
    } catch (e) {
      setDiagnostic('blocked');
    }
  };

  const saveToHistory = (query: string) => {
    const newItem = { query, timestamp: Date.now() };
    const updated = [newItem, ...history.filter(h => h.query !== query)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('nova_gateway_history', JSON.stringify(updated));
  };

  const handleGo = async (e?: React.FormEvent, manualQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = manualQuery || url;
    if (!targetQuery.trim()) return;

    setLoading(true);
    setResult(null);
    setSources([]);
    setError(null);
    setShowHistory(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const isUrl = targetQuery.includes('.') && !targetQuery.includes(' ');
      
      const systemInstruction = provider === 'stealth' 
        ? "You are a secure data relay. Provide an anonymous, objective report of the content. Filter all provider branding. DO NOT mention your origin or use phrases like 'As an AI' or 'Search results'. Provide raw data points only."
        : "You are the Core Relay. Extract primary information from the specified target. Ensure high data fidelity. Present in clean Markdown structure.";

      const prompt = isUrl 
        ? `Render content packet for: ${targetQuery}. Focus on primary text. Format: Markdown.`
        : `Lookup: "${targetQuery}". Summarize findings objectively. Format: Markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text;
      setResult(text);
      saveToHistory(targetQuery);

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        const foundSources = groundingChunks
          .map((chunk: any) => chunk.web)
          .filter((web: any) => web && web.uri);
        setSources(foundSources);
      }
    } catch (err: any) {
      console.error(err);
      setError("Endpoint Refused: The node was unable to reach the uplink provider. This usually happens if 'googleapis.com' or the relay endpoint is blocked by your firewall.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Activity size={14} className={loading ? "animate-pulse text-indigo-400" : ""} /> Node Uplink Status: Active
        </div>
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-slate-200">Relay Gateway</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base font-medium">
          Secure, encapsulated data retrieval. If connections fail, use the diagnostic tool to check your local network restrictions.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setProvider('core')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${provider === 'core' ? 'bg-slate-700 text-white border border-slate-600' : 'text-slate-500 hover:text-slate-300 bg-slate-800/50'}`}
            >
              <Cpu size={14} /> Core Node
            </button>
            <button 
              onClick={() => setProvider('stealth')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${provider === 'stealth' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:text-slate-300 bg-slate-800/50'}`}
            >
              <Shield size={14} /> Stealth Node
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={runDiagnostic}
              className={`p-2 rounded-lg transition-all text-xs font-bold flex items-center gap-2 ${
                diagnostic === 'testing' ? 'text-indigo-400 animate-pulse' : 
                diagnostic === 'success' ? 'text-emerald-400' :
                diagnostic === 'blocked' ? 'text-red-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Activity size={18} />
              <span className="hidden sm:inline">
                {diagnostic === 'testing' ? 'Testing Link...' : 
                 diagnostic === 'success' ? 'Link OK' :
                 diagnostic === 'blocked' ? 'Link Refused' : 'Diagnostic'}
              </span>
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-all ${showHistory ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              title="Cache"
            >
              <Clock size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleGo} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {loading ? <Loader2 size={18} className="text-indigo-500 animate-spin" /> : <Search size={18} className="text-slate-600" />}
            </div>
            <input 
              type="text" 
              placeholder="Enter destination URL or data request..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-700 transition-all font-mono text-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !url.trim()}
            className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-700 text-slate-100 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-700"
          >
            {loading ? "Relaying..." : "Execute"}
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>

        {showHistory && (
          <div className="mt-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 animate-in slide-in-from-top-2">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 px-2">Local Cache</h4>
            <div className="space-y-1">
              {history.length > 0 ? history.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => { setUrl(item.query); handleGo(undefined, item.query); }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 transition-colors text-left"
                >
                  <span className="text-sm text-slate-400 truncate font-mono">{item.query}</span>
                  <ChevronRight size={14} className="text-slate-700" />
                </button>
              )) : (
                <p className="text-center py-4 text-slate-700 text-xs font-mono">CACHE_EMPTY</p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/30 text-red-400 p-6 rounded-[2rem] space-y-2 animate-in shake">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-red-500" />
            <p className="font-bold text-lg">Connection Refused</p>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Your current network is refusing connections to the remote provider endpoints. 
            <br />
            <strong>Possible fix:</strong> Use a cellular hotspot or a non-institutional DNS if you have administrative control.
          </p>
        </div>
      )}

      {loading && (
        <div className="py-24 flex flex-col items-center gap-6">
          <div className="w-20 h-20 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
          <div className="text-center space-y-1">
            <p className="text-xl font-orbitron font-bold text-slate-300">establishing_tunnel...</p>
            <p className="text-slate-600 text-xs font-mono">STATUS: FETCHING_REMOTE_ASSETS</p>
          </div>
        </div>
      )}

      {result && (
        <div ref={resultRef} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8">
          <div className="bg-slate-800/30 p-5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => setResult(null)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-500"><ArrowLeft size={18} /></button>
              <span className="text-xs font-mono text-slate-500 truncate max-w-[200px]">{url}</span>
            </div>
            <button onClick={() => navigator.clipboard.writeText(result)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-500"><Copy size={18} /></button>
          </div>
          
          <div className="p-8 md:p-12 prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-inter space-y-6">
              {result.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-orbitron font-bold text-slate-100 mt-8 mb-6 border-b border-slate-800 pb-4">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-orbitron font-bold text-slate-200 mt-8 mb-4">{line.replace('## ', '')}</h2>;
                if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-slate-400 list-disc my-1">{line.substring(2)}</li>;
                return <p key={i} className="text-slate-400">{line}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gateway;
