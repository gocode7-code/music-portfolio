import React, { useState } from "react";
import { Music, Menu, X, Radio, Disc, Mic2, ShieldCheck } from "lucide-react";
import { ActiveView } from "../types";

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  syncing: boolean;
}

export default function Navbar({ activeView, setActiveView, syncing }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Hustlers Studio", icon: <Mic2 className="w-4 h-4" /> },
    { id: "songs", label: "The Catalog", icon: <Disc className="w-4 h-4" /> },
    { id: "about", label: "Our Journey", icon: <Radio className="w-4 h-4" /> },
    { id: "admin", label: "HQ Console", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-obsidian/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Title */}
        <div 
          onClick={() => handleNavClick("home")} 
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Music className="w-5 h-5" />
            {syncing && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white">Wajahat Shah</span>
            <span className="block text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Shayar // Hustlers</span>
          </div>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display text-sm font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-550 text-white shadow-lg bg-emerald-600/35 border border-emerald-400/40 text-cyber-glow"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sync status indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[10px] font-mono leading-none text-zinc-500">ENGINE STATUS</span>
            <span className="text-xs font-mono font-medium text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className={`inline-block w-2 bg-emerald-500 rounded-full aspect-square ${syncing ? 'animate-pulse' : ''}`} />
              LIVE AGGREGATOR
            </span>
          </div>
        </div>

        {/* Mobile Hamburger trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Slide-out Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-zinc-950/95 border-b border-emerald-500/10 p-6 flex flex-col gap-4 animate-fade-in backdrop-blur-xl md:hidden">
          <div className="text-xs font-mono tracking-wider text-emerald-500 uppercase px-3">
            Hustler Navigation Index:
          </div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center gap-3.5 px-4 py-3 rounded-xl font-display text-base font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 text-cyber-glow"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between px-3">
            <span className="text-xs font-mono text-zinc-500">ARTIST IDENTITY</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">SHAYAR (WAJAHAT SHAH)</span>
          </div>
        </div>
      )}
    </header>
  );
}
