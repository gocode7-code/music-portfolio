import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Songs from "./components/Songs";
import Admin, { FormData as AdminFormData } from "./components/Admin";
import Footer from "./components/Footer";
import { Track, Subscriber, AggregatorStats, SyncLog, ActiveView } from "./types";
import { Volume2, Play, Pause, Disc, ArrowUpRight, SkipForward, SkipBack, Sparkles } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<AggregatorStats>({
    spotifyStreams: 135500,
    youtubeViews: 245000,
    instagramFollowers: 18900,
    subscriberCount: 3840,
    youtubeSubscriberCount: 15400,
    lastYoutubeSync: new Date().toISOString(),
    isSyncing: false,
  });
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Audio system state
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initial Data Fetch
  const fetchData = async () => {
    try {
      const [tracksRes, subsRes, statsRes, logsRes] = await Promise.all([
        fetch("/api/tracks"),
        fetch("/api/subscribers"),
        fetch("/api/aggregator/stats"),
        fetch("/api/aggregator/logs"),
      ]);

      if (tracksRes.ok) setTracks(await tracksRes.json());
      if (subsRes.ok) setSubscribers(await subsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (logsRes.ok) setSyncLogs(await logsRes.json());
    } catch (err) {
      console.error("Failed to fetch state data from server", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Audio side effects
  useEffect(() => {
    if (activeTrack && audioRef.current) {
      audioRef.current.src = activeTrack.audioUrl;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Playback error:", err));
      }
    }
  }, [activeTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Playback error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio events
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    // Cycle to next track automatically
    handleNextTrack();
  };

  // Play/Pause toggle
  const handleTogglePlay = () => {
    if (!activeTrack && tracks.length > 0) {
      setActiveTrack(tracks[0]);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePlayTrack = (track: Track) => {
    if (activeTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (!activeTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === activeTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setActiveTrack(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (!activeTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === activeTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setActiveTrack(tracks[prevIndex]);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Admin Actions
  const handleAddTrack = async (formData: AdminFormData) => {
    const res = await fetch("/api/tracks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const newTrack = await res.json();
      setTracks((prev) => [newTrack, ...prev]);
      if (!activeTrack) {
        setActiveTrack(newTrack);
      }
      return newTrack;
    } else {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to add track to system.");
    }
  };

  const handleDeleteTrack = async (id: string) => {
    const res = await fetch(`/api/tracks/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTracks((prev) => prev.filter((t) => t.id !== id));
      if (activeTrack?.id === id) {
        setActiveTrack(null);
        setIsPlaying(false);
      }
    }
  };

  const handleTriggerSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/aggregator/sync", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setSyncLogs(data.logs);
        setTracks(data.tracks);
        // Toast style state notification
      }
    } catch (err) {
      console.error("Failed to sync aggregates");
    } finally {
      setSyncing(false);
    }
  };

  // Seek format MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-obsidian text-zinc-100 font-sans flex flex-col relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Immersive Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none -z-10 bg-gradient-to-b from-[#0e1713]/25 via-transparent to-transparent"></div>
      <div className="absolute top-1/3 left-1/4 w-[35%] h-[35%] bg-emerald-550 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-[2%] w-[40%] h-[40%] bg-zinc-950/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.04] pointer-events-none -z-10"></div>

      {/* Hidden Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Dynamic Navigation bar */}
      <Navbar activeView={activeView} setActiveView={setActiveView} syncing={syncing} />

      {/* Primary content area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-36">
        {activeView === "home" && (
          <Home
            tracks={tracks}
            stats={stats}
            onPlayTrack={handlePlayTrack}
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            onSetView={setActiveView}
          />
        )}

        {activeView === "about" && <About />}

        {activeView === "songs" && (
          <Songs
            tracks={tracks}
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            onPlayTrack={handlePlayTrack}
          />
        )}

        {activeView === "admin" && (
          <Admin
            tracks={tracks}
            subscribers={subscribers}
            stats={stats}
            syncLogs={syncLogs}
            onAddTrack={handleAddTrack}
            onDeleteTrack={handleDeleteTrack}
            onTriggerSync={handleTriggerSync}
            syncing={syncing}
          />
        )}
      </main>

      {/* Global Persistent Brand Footer */}
      <Footer onSetView={setActiveView} />

      {/* Global Bottom Web-Streaming Player Interface */}
      {activeTrack && (
        <footer className="fixed bottom-0 inset-x-0 h-24 bg-zinc-950 border-t border-white/10 flex items-center justify-between px-4 sm:px-10 gap-4 sm:gap-10 z-50 shadow-[0_-15px_35px_rgba(0,0,0,0.85)]">
          {/* Left: Interactive Cover disc & title info */}
          <div className="flex items-center gap-3.5 w-[45%] sm:w-1/4 min-w-0">
            <div className={`w-12 h-12 bg-zinc-900 border border-white/10 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden flex-col group ${isPlaying ? 'animate-pulse' : ''}`}>
              <Disc className={`w-6 h-6 text-emerald-450 text-emerald-450 ${isPlaying ? 'animate-spin' : 'text-zinc-600'}`} style={{ animationDuration: "5s" }} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[8px] font-mono text-emerald-400">Vault</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-tight text-white truncate">{activeTrack.title}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate">Shayar &bull; Solo Movement</p>
            </div>
          </div>

          {/* Center: Play controllers & interactive timeline seeker */}
          <div className="flex-1 flex flex-col items-center gap-1.5 max-w-[500px]">
            <div className="flex items-center gap-4.5 sm:gap-6">
              <button onClick={handlePrevTrack} className="w-5 h-5 text-zinc-500 hover:text-white transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full border border-white/20 bg-white hover:bg-emerald-400 text-black hover:text-black hover:border-emerald-400 flex items-center justify-center transition-all shadow-md shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button onClick={handleNextTrack} className="w-5 h-5 text-zinc-500 hover:text-white transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-full flex items-center gap-3.5">
              <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-zinc-500 w-8">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Sound bouncing visualizer & Volume Control */}
          <div className="w-1/4 hidden md:flex justify-end items-center gap-6">
            {/* Interactive Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-zinc-500" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Bouncing spectrum */}
            {isPlaying ? (
              <div className="flex gap-0.5 items-end h-6">
                <div className="w-[3px] h-3 bg-emerald-400 bar-bounce animation-delay-100"></div>
                <div className="w-[3px] h-5 bg-emerald-400 bar-bounce animation-delay-300"></div>
                <div className="w-[3px] h-2 bg-emerald-400 bar-bounce animation-delay-200"></div>
                <div className="w-[3px] h-4 bg-emerald-400 bar-bounce animation-delay-500"></div>
                <div className="w-[3px] h-6 bg-emerald-300 bar-bounce animation-delay-400"></div>
              </div>
            ) : (
              <div className="flex gap-0.5 items-end h-6">
                <div className="w-[3px] h-1.5 bg-zinc-700"></div>
                <div className="w-[3px] h-1.5 bg-zinc-700"></div>
                <div className="w-[3px] h-1.5 bg-zinc-700"></div>
                <div className="w-[3px] h-1.5 bg-zinc-700"></div>
                <div className="w-[3px] h-1.5 bg-zinc-700"></div>
              </div>
            )}

            <button
              onClick={() => setActiveView("songs")}
              className="text-[9px] uppercase font-mono font-bold tracking-widest border border-emerald-500/20 bg-emerald-900/10 text-emerald-400 px-3 py-1.5 rounded hover:bg-emerald-500/20 transition-all text-cyber-glow"
            >
              Lyrics
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
