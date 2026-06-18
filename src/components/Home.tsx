import React, { useState } from "react";
import { Play, Flame, Music, Youtube, Instagram, Radio, Quote, Sparkles, CheckCircle, Mail, Disc } from "lucide-react";
import { Track, AggregatorStats } from "../types";

interface HomeProps {
  tracks: Track[];
  stats: AggregatorStats;
  onPlayTrack: (track: Track) => void;
  activeTrack: Track | null;
  isPlaying: boolean;
  onSetView: (view: "home" | "about" | "songs" | "admin") => void;
}

export default function Home({ tracks, stats, onPlayTrack, activeTrack, isPlaying, onSetView }: HomeProps) {
  const [subName, setSubName] = useState("");
  const [subEmail, setSubEmail] = useState("");
  const [subPlatform, setSubPlatform] = useState("Spotify");
  const [subSuccess, setSubSuccess] = useState<string | null>(null);
  const [subError, setSubError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Latest Track is the first track in our array
  const latestTrack = tracks[0] || null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subEmail) return;

    setSubmitting(true);
    setSubError(null);
    setSubSuccess(null);

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subName, email: subEmail, preferredPlatform: subPlatform }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubSuccess(`Zindabad! Welcome to the Hustlers Movement. You're set for the next dropping.`);
        setSubName("");
        subEmail === "" ? null : setSubEmail("");
      } else {
        setSubError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setSubError("Failed to register. Server is offline.");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedViews = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div id="home-view" className="space-y-12 animate-fade-in relative">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/25 blur-[150px] rounded-full"></div>
      </div>

      {/* Visual Identity Hero Banners */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-black/45 shadow-2xl shadow-red-950/10 select-none">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent z-10"></div>
        {/* Neon signboard banner asset image as background */}
        <img 
          src="/input_file_1.png" 
          alt="Hustlers Neon Sign" 
          className="w-full h-44 sm:h-56 md:h-64 object-cover object-center filter brightness-90 animate-pulse"
          style={{ animationDuration: "8s" }}
          referrerPolicy="no-referrer"
        />
        
        {/* Floating Logo Badge on top of Neon sign */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 z-20 flex items-center gap-4">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl border border-red-500/35 bg-zinc-950/95 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-550 group">
            <img 
              src="/input_file_0.png" 
              alt="Hustlers Metal Emblem" 
              className="w-full h-full object-contain filter group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest text-red-500 bg-red-950/40 border border-red-500/20 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Live Portal
            </span>
            <h2 className="text-xl sm:text-3xl font-display font-black text-white leading-none tracking-tight uppercase">
              Hustlers <span className="bg-gradient-to-r from-red-550 to-red-450 bg-clip-text text-[#EF4444]">Music</span>
            </h2>
            <p className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Official Channel // Wajahat Shah // Dev Hub
            </p>
          </div>
        </div>
      </div>

      {/* Hero & Intro Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Persona & Biography */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-[0.4em] uppercase text-zinc-500 font-bold block">ARTIST IDENTITY</span>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-10 bg-emerald-400"></span>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Shayar is Wajahat Shah</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-black uppercase tracking-tighter leading-[0.85] text-white">
            WAJAHAT<br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">SHAH</span>
          </h1>

          <div className="relative">
            <Quote className="absolute -top-3 -left-3 w-8 h-8 text-emerald-900/40 -z-10" />
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-sans italic pl-4 border-l border-emerald-500/20">
              "Welcome to <span className="text-emerald-300 font-semibold font-mono">Hustlers</span> – The Official Channel of Shayar. One artist, one vision: Shayar — a raw talent with a pen that bleeds truth. He writes powerful lyrics, delivers catchy hooks, and blends rap with soulful singing like no other. An underground hip-hop movement born in small spaces with big dreams. Hustlers isn’t just a name. It’s a movement."
            </p>
          </div>

          {/* Aggregated Realtime stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl backdrop-blur-md">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">TOTAL VIEWS AGGREGATE</span>
              <span className="text-2xl font-mono font-bold text-white tracking-tight">
                {formattedViews(stats.youtubeViews + stats.spotifyStreams)}
              </span>
              <div className="h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 w-[78%]"></div>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl backdrop-blur-md">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">STREET MOVEMENT</span>
              <span className="text-2xl font-mono font-bold text-emerald-400 tracking-tight">
                {formattedViews(stats.subscriberCount + stats.youtubeSubscriberCount)}
              </span>
              <div className="h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[63%]"></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onSetView("songs")}
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/25"
            >
              <Music className="w-4 h-4" />
              Listen to the Catalog
            </button>
            <button 
              onClick={() => onSetView("about")}
              className="flex-1 h-12 border border-white/10 hover:border-emerald-500/50 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              Our Story
            </button>
          </div>
        </div>

        {/* Right Side: Showcase Latest Drop Cover Detail */}
        <div className="lg:col-span-7 space-y-6">
          {latestTrack && (
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 p-6 flex flex-col justify-between h-[340px] md:h-[380px] bg-gradient-to-t from-[#050505] via-zinc-950/40 to-transparent">
              {/* Cover Background Graphic with real overlay */}
              <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"></div>
              <div className="absolute inset-0 -z-10 bg-zinc-950/80"></div>

              {/* Badges */}
              <div className="flex justify-between items-start">
                <div className="px-3 py-1 bg-emerald-500 text-black text-[9px] font-mono font-bold uppercase tracking-wider rounded-md">
                  Latest drop
                </div>
                <div className="flex gap-2">
                  {latestTrack.youtubeUrl && (
                    <a href={latestTrack.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/40 hover:bg-emerald-500/20 text-white hover:text-emerald-400 rounded-lg backdrop-blur-sm border border-white/5 transition-all">
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {latestTrack.instagramUrl && (
                    <a href={latestTrack.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/40 hover:bg-emerald-500/20 text-white hover:text-emerald-400 rounded-lg backdrop-blur-sm border border-white/5 transition-all">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Title & metadata */}
              <div>
                <span className="text-[11px] font-mono text-emerald-400 tracking-widest block mb-2 font-semibold">
                  Prod. by {latestTrack.producer}
                </span>
                <h3 className="text-4xl md:text-5xl font-display font-black uppercase text-white tracking-tight mb-2">
                  {latestTrack.title}
                </h3>
                
                <p className="text-zinc-400 text-xs md:text-sm font-mono flex items-center gap-1.5 mb-4">
                  <Flame className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                  Hook: "{latestTrack.hookHighlight || 'Raw Karachi Hip-Hop'}"
                </p>

                {/* Instant interactive Play trigger */}
                <button
                  onClick={() => onPlayTrack(latestTrack)}
                  className="px-6 py-3 bg-white text-black hover:bg-emerald-400 hover:text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center gap-3"
                >
                  <Play className={`w-4 h-4 ${isPlaying && activeTrack?.id === latestTrack.id ? "animate-spin" : "fill-current"}`} />
                  {isPlaying && activeTrack?.id === latestTrack.id ? "Now Vibing" : "Instant Play Stream"}
                </button>
              </div>
            </div>
          )}

          {/* Social Streaming platform quick connection boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl hover:border-emerald-500/20 hover:bg-zinc-900/60 transition-all flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10 group-hover:scale-105 transition-transform">
                <Disc className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="block text-[10px] font-mono text-zinc-500">SPOTIFY STREAM</span>
                <span className="font-sans font-bold text-white text-sm">{formattedViews(stats.spotifyStreams)} Plays</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl hover:border-emerald-500/20 hover:bg-zinc-900/60 transition-all flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10 group-hover:scale-105 transition-transform">
                <Youtube className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-mono text-zinc-500">YOUTUBE SUBCRIBERS</span>
                <span className="font-sans font-bold text-white text-sm">{formattedViews(stats.youtubeSubscriberCount)} Fans</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl hover:border-emerald-500/20 hover:bg-zinc-900/60 transition-all flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10 group-hover:scale-105 transition-transform">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-mono text-zinc-500">INSTAGRAM REACH</span>
                <span className="font-sans font-bold text-white text-sm">{formattedViews(stats.instagramFollowers)} Crew</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded dynamic YouTube and tracklist stream feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        {/* Left 2 Cols: Streaming Tracks Quick Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">STREET MUSIC CATALOG</span>
              <h3 className="text-2xl font-display font-black text-white uppercase italic">Active Vault Reels</h3>
            </div>
            <button 
              onClick={() => onSetView("songs")}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              See Full Tracklist ({tracks.length}) &rarr;
            </button>
          </div>

          <div className="space-y-3.5">
            {tracks.map((track, i) => (
              <div 
                key={track.id} 
                className={`p-4 bg-zinc-900/40 hover:bg-zinc-900/60 border rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                  activeTrack?.id === track.id ? "border-emerald-500/30 bg-emerald-950/10" : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5 text-zinc-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all font-mono font-bold pr-0.5">
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100 group-hover:text-white transition-colors">{track.title}</h4>
                    <p className="text-zinc-500 text-xs font-mono">Prod. by {track.producer} &bull; {track.type.toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t border-white/5 md:border-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">STREET POWER</span>
                    <span className="text-xs font-mono font-medium text-emerald-300">
                      {formattedViews(track.streams)} streams
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPlayTrack(track)}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${
                        activeTrack?.id === track.id && isPlaying
                          ? "bg-emerald-400 text-black"
                          : "bg-zinc-800 text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 border border-white/5"
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Col: Dynamic street newsletter / interactions registry */}
        <div className="space-y-6">
          <div className="p-6 bg-zinc-900/70 border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md">
            {/* Glow accent */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/15 blur-2xl rounded-full"></div>

            <div className="flex items-center gap-2.5 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-450 fill-emerald-500/20 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Join Hustlers Movement</span>
            </div>

            <h4 className="text-xl font-display font-black text-white uppercase italic leading-tight mb-2">
              Subscribe to the Hustlers Fanbase
            </h4>
            
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Get notified immediately on your preferred platform as soon as Shayar drops fresh studio heat, unreleased tracks, and freestyle lyrics.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Your Name / Stage Name</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Ali HipHop"
                  className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="e.g. ali@gmail.com"
                  className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Preferred Listen Mode</label>
                <select
                  value={subPlatform}
                  onChange={(e) => setSubPlatform(e.target.value)}
                  className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-zinc-400 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40"
                >
                  <option value="Spotify">Spotify Streams</option>
                  <option value="YouTube">YouTube Videos</option>
                  <option value="Instagram">Instagram Reels</option>
                  <option value="Soundcloud">Direct Vault Audio</option>
                </select>
              </div>

              {subSuccess && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{subSuccess}</span>
                </div>
              )}

              {subError && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-lg">
                  {subError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-white hover:bg-emerald-450 hover:bg-emerald-400 hover:text-black text-black font-semibold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {submitting ? "Registering..." : "Submit to Movement"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
