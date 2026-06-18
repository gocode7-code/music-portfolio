import React, { useState } from "react";
import { Mic2, Music, Award, Users, MapPin, Calendar, Compass, Star, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function About() {
  const [activeTab, setActiveTab] = useState<"journey" | "philosophies">("journey");

  const timelineEvents = [
    {
      year: "2023",
      title: "Rooftop Beginnings",
      description: "Shayar (Wajahat Shah) starts recording inside standard, cramped spaces on Karachi rooftops. Creating DIY sound-dampeners from old wool rugs, he records raw Urdu lyrics onto a budget microphone, establishing the signature gritty sonic footprint of Hustlers.",
      tag: "Origins"
    },
    {
      year: "2024",
      title: "The Movement Ignites",
      description: "Launches the 'Hustlers' independent street banner with his first unedited street freestyle. The viral reception on late-night channels solidifies his reputation as the uncompromised voice of urban Karachi.",
      tag: "Viral Drop"
    },
    {
      year: "2025",
      title: "Karachi Chronicles Single",
      description: "His break-out track 'Karachi Chronicles' breaks stream milestones. Shayar's distinctive delivery—which seamlessly blends blistering fast-paced rap verses with raw, soul-stirring vocal singing—secures national attention from underground lists.",
      tag: "Milestone"
    },
    {
      year: "2026",
      title: "Launch of Music Verse",
      description: "Designed a secure digital stream hub to connect streaming portals live, putting absolute ownership back into the hands of Shayar and bypasses standard commercial gatekeepers.",
      tag: "Digital Age"
    }
  ];

  const artisticDimensions = [
    {
      title: "The Poet (Shayar)",
      character: "The Pen That Bleeds Truth",
      bio: "Wajahat Shah utilizes intricate Urdu vocabulary and storytelling blocks to tackle real urban narratives. He avoids commercial themes, focusing on Karachi's raw midnight reality, deep introspection, and social struggles.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400",
      vibe: "Intricate Writing & Metaphor masteries",
      accent: "from-emerald-500/20 to-emerald-950/40"
    },
    {
      title: "The Performer",
      character: "Soulful Singer & Aggressive MC",
      bio: "Blending razor-sharp rap delivery with deep, melancholic Urdu singing. Shayar manages his own vocal production and soundscapes, crafting the iconic heavy low-end melodies that drive the Hustlers movement.",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400",
      vibe: "Dual Delivery Styles & Melodic Beats",
      accent: "from-red-500/10 to-zinc-950/80"
    }
  ];

  return (
    <div id="about-view" className="space-y-12 relative">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-15%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-15%] w-[50%] h-[50%] bg-emerald-950/20 blur-[150px] rounded-full"></div>
      </div>

      {/* Editor Main Heading */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-white/5 pb-8"
      >
        <span className="text-[11px] font-mono tracking-[0.4em] uppercase text-zinc-500 font-bold block mb-2">EDITORIAL DOSSIER</span>
        <h2 className="text-4xl md:text-5xl font-sans font-black uppercase italic text-white tracking-tight">
          Shayar: <span className="text-emerald-400 text-cyber-glow">The Solo Crusade</span>
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl mt-3 font-sans">
          Welcome to Hustlers – The Official Channel of Shayar. One artist, one vision: Shayar — a raw talent with a pen that bleeds truth. He writes powerful lyrics, delivers catchy hooks, and blends rap with soulful singing like no other. An underground hip-hop movement born in small spaces with big dreams. Hustlers isn’t just a name. It’s a movement.
        </p>
      </motion.div>

      {/* Navigation tabs */}
      <div className="flex border-b border-white/5 gap-2">
        <button
          onClick={() => setActiveTab("journey")}
          className={`pb-4 px-4 font-display text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeTab === "journey"
              ? "border-emerald-400 text-emerald-400 text-cyber-glow font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Solo Timeline & Milestones
        </button>
        <button
          onClick={() => setActiveTab("philosophies")}
          className={`pb-4 px-4 font-display text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeTab === "philosophies"
              ? "border-emerald-400 text-emerald-400 text-cyber-glow font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Artistic Dimensions & Values
        </button>
      </div>

      {/* TAB CONTENT 1: Timeline */}
      <AnimatePresence mode="wait">
        {activeTab === "journey" && (
          <motion.div 
            key="journey"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Main timeline */}
            <div className="lg:col-span-8 space-y-8">
              <div className="relative border-l-2 border-emerald-500/10 pl-6 ml-4 space-y-10">
                {timelineEvents.map((event, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="relative group"
                  >
                    {/* Timeline indicator node */}
                    <span className="absolute -left-[33px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 border-2 border-emerald-500 group-hover:scale-125 transition-transform duration-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    </span>

                    {/* Period tag */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-mono font-bold text-white bg-white/5 px-2.5 py-0.5 rounded border border-white/5">{event.year}</span>
                      <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/10">{event.tag}</span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors uppercase font-display tracking-wide">{event.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mt-2 pl-1 font-sans">{event.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side stats callout boxes */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-6 bg-zinc-900/55 border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md hover:border-emerald-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-mono text-white uppercase font-bold tracking-wider mb-2">Karachi Night Roots</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Every verse captures the grit of midnight street strolls, local transport frequencies, heavy sea breeze whispers, and industrial neon atmospheres.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="p-6 bg-zinc-900/55 border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md hover:border-red-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-mono text-white uppercase font-bold tracking-wider mb-2">Independent Creed</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Hustlers operates entirely outside mainstream record labels. Shayar preserves 100% control over vocal production, digital streams, metrics, and lyric themes.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT 2: Member Profiles */}
        {activeTab === "philosophies" && (
          <motion.div 
            key="philosophies"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {artisticDimensions.map((dimension, i) => (
              <div key={i} className={`p-6 bg-gradient-to-br ${dimension.accent} border border-white/10 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-4 border-l border-b border-white/5 text-[10px] font-mono text-emerald-400 tracking-wider font-bold">
                  DIMENSION 0{i + 1}
                </div>

                <div className="space-y-4">
                  {/* Image wrapper */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
                    <img 
                      src={dimension.image} 
                      alt={dimension.title} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/5">
                      <span className="text-[10px] font-mono text-emerald-400 tracking-wider font-semibold uppercase">{dimension.vibe}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-display font-black text-white uppercase italic">{dimension.title}</h3>
                    <p className="text-xs font-mono text-zinc-500 mt-0.5">{dimension.character}</p>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed">{dimension.bio}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">HUSTLERS BADGE</span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Street Philosophy Statement */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="p-8 bg-zinc-950 border border-emerald-500/10 rounded-2xl text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
        <span className="text-[10px] font-mono text-emerald-400 tracking-[0.3em] uppercase block mb-3 font-black">THE DIRECTIVE STATEMENT</span>
        <h3 className="text-xl md:text-3xl font-display font-bold uppercase italic text-zinc-100 max-w-3xl mx-auto leading-tight">
          "Hustlers is not just standard music. It is a solo street movement to represent the unvarnished urban reality of Pakistan, writing one verse at a time with a pen that bleeds truth."
        </h3>
        <p className="text-zinc-500 text-xs font-mono mt-4">&mdash; Shayar (Wajahat Shah)</p>
      </motion.div>
    </div>
  );
}
