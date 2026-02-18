
import React from 'react';
import { Shield, Lock, Zap, Cpu, Code, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700">
      <section className="text-center space-y-6">
        <h2 className="text-4xl md:text-6xl font-orbitron font-extrabold">About the Platform</h2>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Nova Arcade & Gateway was designed to facilitate unrestricted information flow in highly monitored environments. We focus on decentralized data relay and lightweight entertainment.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            icon: Lock, 
            title: "Private Uplink", 
            desc: "Browser scores are stored locally. Gateway requests are handled by distributed compute clusters, ensuring no traffic is directly associated with your IP." 
          },
          { 
            icon: Cpu, 
            title: "Neural Content Parsing", 
            desc: "Our Gateway uses advanced semantic grounding to reconstruct blocked web content into a safe, text-only reading format." 
          },
          { 
            icon: Zap, 
            title: "Optimized Performance", 
            desc: "All games are custom-built for low-overhead execution, ensuring smooth 60FPS performance even on low-spec hardware." 
          },
          { 
            icon: Globe, 
            title: "Global Relay Network", 
            desc: "By utilizing a multi-node architecture, Nova bypasses DNS blocks and IP-based firewalls commonly found in institutional networks." 
          }
        ].map((item, i) => (
          <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-indigo-500/30 transition-all space-y-4">
            <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center">
              <item.icon className="text-indigo-500" size={24} />
            </div>
            <h3 className="text-xl font-orbitron font-bold">{item.title}</h3>
            <p className="text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <section className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center space-y-6">
        <Code size={48} className="mx-auto text-indigo-400 mb-4" />
        <h2 className="text-3xl font-orbitron font-bold">Technical Specifications</h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {["React Engine", "TypeScript 5+", "Atomic CSS", "Neural Grounding", "Lucide Assets", "HTML5 Canvas"].map((tech, i) => (
            <span key={i} className="bg-slate-900 px-4 py-2 rounded-full border border-slate-800 text-slate-300 font-medium">{tech}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
