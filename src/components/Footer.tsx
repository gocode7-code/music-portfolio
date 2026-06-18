import React from "react";
import { ActiveView } from "../types";
import { Youtube, Instagram, Music, Shield, Terminal, Sparkles, AlertCircle, Cpu } from "lucide-react";
import { motion } from "motion/react";

interface FooterProps {
  onSetView: (view: ActiveView) => void;
}

export default function Footer({ onSetView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0B0B0F]/90 backdrop-blur-md border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 mt-auto z-40">
      {/* Background radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[150px] bg-gradient-to-t from-emerald-500/5 to-transparent blur-[60px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Branding, Statement */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-red-500/20 bg-zinc-950 flex items-center justify-center p-1">
              <img 
                src="/input_file_0.png" 
                alt="Hustlers Emblem" 
                className="w-full h-full object-contain filter brightness-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-sm font-sans font-black uppercase italic tracking-wider text-white">
                Wajahat Shah (Shayar)
              </span>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
                Hustlers Movement &bull; Music Verse
              </p>
            </div>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm font-sans">
            "One artist, one vision: Shayar — a raw talent with a pen that bleeds truth. He writes powerful lyrics, delivers catchy hooks, and blends rap with soulful singing like no other."
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-white/5 bg-zinc-950/65 text-[9px] font-mono text-emerald-400">
              <Terminal className="w-3 h-3" />
              BUILD: v2.6.2026
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-white/5 bg-zinc-950/65 text-[9px] font-mono text-red-500">
              <Cpu className="w-3 h-3 animate-pulse" />
              STATUS: SYNCED
            </span>
          </div>
        </div>

        {/* Center Column: Quick Navigation Links */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-mono text-zinc-500 uppercase font-black tracking-widest border-b border-white/5 pb-2">
            System Index
          </h4>
          <ul className="space-y-2.5 text-xs font-mono">
            <li>
              <button 
                onClick={() => onSetView("home")} 
                className="text-zinc-400 hover:text-emerald-400 transition-colors uppercase cursor-pointer flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 bg-zinc-700 group-hover:bg-emerald-400 rounded-full transition-colors"></span>
                01 - Showcase Hub
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSetView("songs")} 
                className="text-zinc-400 hover:text-emerald-400 transition-colors uppercase cursor-pointer flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 bg-zinc-700 group-hover:bg-emerald-400 rounded-full transition-colors"></span>
                02 - Audio Vault & Lyric Sheets
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSetView("about")} 
                className="text-zinc-400 hover:text-emerald-400 transition-colors uppercase cursor-pointer flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 bg-zinc-700 group-hover:bg-emerald-400 rounded-full transition-colors"></span>
                03 - Editorial Story & Journey
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSetView("admin")} 
                className="text-zinc-400 hover:text-emerald-400 transition-colors uppercase cursor-pointer flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 bg-zinc-700 group-hover:bg-emerald-400 rounded-full transition-colors"></span>
                04 - Admin Console Dashboard
              </button>
            </li>
          </ul>
        </div>

        {/* Right Column: Premium Social Channel Grids */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-mono text-zinc-500 uppercase font-black tracking-widest border-b border-white/5 pb-2">
            Social Sync Feeds
          </h4>

          <div className="space-y-2.5">
            {/* YouTube Social Card */}
            <a 
              href="https://www.youtube.com/@hustlersmusicofficial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-zinc-950/45 hover:border-emerald-500/20 hover:bg-emerald-950/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Youtube className="w-4 h-4 text-zinc-500 group-hover:text-[#EF4444] transition-colors" />
                <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">Hustlers YouTube Channel</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 group-hover:text-emerald-400 transition-colors uppercase">Official &bull; Subscribe</span>
            </a>

            {/* Instagram Hustlers Social Card */}
            <a 
              href="https://instagram.com/hustlersmusicofficial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-zinc-950/45 hover:border-emerald-500/20 hover:bg-emerald-950/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">Hustlers Instagram</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 group-hover:text-emerald-400 transition-colors uppercase">Official &bull; Crew</span>
            </a>

            {/* Instagram Shayar Social Card */}
            <a 
              href="https://instagram.com/shayarmuxic" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-zinc-950/45 hover:border-emerald-500/20 hover:bg-emerald-950/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-zinc-500 group-hover:text-red-500 transition-colors" />
                <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">Shayar Solo IG</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 group-hover:text-emerald-400 transition-colors uppercase">Solo Feed &bull; Follow</span>
            </a>
          </div>
        </div>
      </div>

      {/* Extreme Bottom Bar: Copyright, Found Credit, Developed by Dev Hub */}
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright metadata */}
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider text-center sm:text-left">
          &copy; {currentYear} Wajahat Shah. ALL RIGHTS RESERVED. SECURED VIA MUSIC VERSE ENGINE.
        </p>

        {/* Agency Credits / Handshakes */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Found by credit */}
          <div className="h-6 px-3 bg-zinc-950 rounded-full border border-white/5 flex items-center gap-1.5 text-[9px] font-mono">
            <span className="text-zinc-500 uppercase font-medium">Found By:</span>
            <span className="text-zinc-300 font-bold uppercase transition-colors hover:text-emerald-400 hover:text-cyber-glow cursor-default">Shayar</span>
          </div>

          {/* Developed by Dev Hub agency badge */}
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="relative h-6 px-3 bg-zinc-950 hover:bg-zinc-900 border border-emerald-500/20 group-hover:border-emerald-400 text-emerald-400 group-hover:text-cyber-glow rounded-full flex items-center gap-1.5 text-[9px] font-mono transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse bg-emerald-400"></span>
              <span className="text-zinc-500 uppercase font-medium">Developed By:</span>
              <span className="font-bold uppercase tracking-wider text-emerald-300">Dev Hub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
