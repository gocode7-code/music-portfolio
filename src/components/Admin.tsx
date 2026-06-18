import React, { useState } from "react";
import { ShieldAlert, RefreshCw, PlusCircle, Trash2, Check, Sparkles, Users, Layers, MessageSquare, Flame } from "lucide-react";
import { Track, Subscriber, SyncLog, AggregatorStats } from "../types";

interface AdminProps {
  tracks: Track[];
  subscribers: Subscriber[];
  stats: AggregatorStats;
  syncLogs: SyncLog[];
  onAddTrack: (track: FormData) => Promise<any>;
  onDeleteTrack: (id: string) => Promise<void>;
  onTriggerSync: () => Promise<void>;
  syncing: boolean;
}

export interface FormData {
  title: string;
  type: "single" | "freestyle" | "collab" | "verse";
  producer: string;
  lyrics: string;
  hookHighlight: string;
  audioUrl: string;
  duration: string;
  youtubeUrl: string;
  spotifyUrl: string;
  instagramUrl: string;
}

export default function Admin({ tracks, subscribers, stats, syncLogs, onAddTrack, onDeleteTrack, onTriggerSync, syncing }: AdminProps) {
  // New track form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "single",
    producer: "Shayar",
    lyrics: "",
    hookHighlight: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:05",
    youtubeUrl: "",
    spotifyUrl: "",
    instagramUrl: "",
  });

  // AI Lyrics assistant state
  const [prompt, setPrompt] = useState("");
  const [beatVibe, setBeatVibe] = useState("Dark 90s boom bap");
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle manual track submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setFormError("Title is required.");
      return;
    }

    try {
      setFormError(null);
      setFormSuccess(null);
      await onAddTrack(formData);
      setFormSuccess("Huzoor! New track successfully added to the vault.");
      // Reset form but keep default files
      setFormData({
        title: "",
        type: "single",
        producer: "Shayar",
        lyrics: "",
        hookHighlight: "",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "3:10",
        youtubeUrl: "",
        spotifyUrl: "",
        instagramUrl: "",
      });
    } catch (err: any) {
      setFormError(err.message || "Failed to create track.");
    }
  };

  // AI Lyrics helper trigger
  const handleGenerateLyrics = async () => {
    if (!prompt) {
      setAiError("Please type a theme or vibe prompt (e.g. کراچی کی سردی, late night reflections).");
      return;
    }

    setGenerating(true);
    setAiError(null);

    try {
      const res = await fetch("/api/lyrics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, beatVibe }),
      });

      const data = await res.json();
      if (res.ok && data.lyrics) {
        setFormData((prev) => ({
          ...prev,
          title: data.title || prev.title || "AI Freestyle Drop",
          lyrics: data.lyrics,
          hookHighlight: data.hookHighlight || prev.hookHighlight,
        }));
        setPrompt("");
      } else {
        setAiError(data.error || "Failed to generate lyrics. Verify API key.");
      }
    } catch (err) {
      setAiError("Failed to connect to official lyrics generator server.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div id="admin-view" className="space-y-10 animate-fade-in relative">
      {/* Absolute background accent */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-red-500/5 blur-3xl pointer-events-none rounded-full"></div>

      {/* Header section with Trigger Sync */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-500 font-bold block mb-1">HQ SECURE CONSOLE</span>
          <h2 className="text-4xl font-sans font-black uppercase italic text-white flex items-center gap-2.5">
            Admin Dashboard
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Last Youtube Sync: {stats.lastYoutubeSync ? new Date(stats.lastYoutubeSync).toLocaleTimeString() : "Never"}
          </p>
        </div>

        {/* Sync Trigger Action */}
        <button
          onClick={onTriggerSync}
          disabled={syncing}
          className={`h-11 px-6 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs rounded-xl tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20 ${
            syncing ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing Platform API..." : "Trigger YouTube Sync Now"}
        </button>
      </div>

      {/* Quick Stats Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[9px] font-mono text-zinc-500 block uppercase">TOTAL VAULT SONGS</span>
          <span className="text-3xl font-bold font-mono tracking-tighter text-white">{tracks.length}</span>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">&bull; Loaded perfectly</p>
        </div>

        <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[9px] font-mono text-zinc-500 block uppercase">TOTAL STREAM VIEWS</span>
          <span className="text-3xl font-bold font-mono tracking-tighter text-white">
            {new Intl.NumberFormat().format(stats.youtubeViews + stats.spotifyStreams)}
          </span>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">&bull; YouTube & Spotify Sync</p>
        </div>

        <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[9px] font-mono text-zinc-500 block uppercase">MOVEMENT REACH</span>
          <span className="text-3xl font-bold font-mono tracking-tighter text-emerald-400">
            {new Intl.NumberFormat().format(subscribers.length + stats.subscriberCount)}
          </span>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">&bull; Newsletter Database Map</p>
        </div>

        <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-red-500/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[9px] font-mono text-zinc-500 block uppercase">PLATFORM SERVER STATUS</span>
          <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 uppercase">ONLINE</span>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">&bull; Port 3000 Active</p>
        </div>
      </div>

      {/* Main Grid: Upload / Edit Form & Sync Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Form Upload & AI helper */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Helper block */}
          <div className="p-6 bg-gradient-to-br from-emerald-950/20 to-zinc-900/60 border border-emerald-500/20 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-450 text-emerald-450 fill-emerald-500/20 text-emerald-400" />
                <h4 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  AI Ghostwriter Assistant (Gemini)
                </h4>
              </div>
              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 uppercase">
                Active
              </span>
            </div>
            
            <p className="text-zinc-400 text-xs leading-relaxed">
              Stuck on rhyming verses? Type a thematic prompt or street mood below to instantly draft customized underground Roman Urdu/English lyrics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Theme (e.g. رات کے مسافر, fast street life)..."
                  className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={beatVibe}
                  onChange={(e) => setBeatVibe(e.target.value)}
                  placeholder="Vibe (e.g. Gritty boom bap, drill)..."
                  className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            {aiError && (
              <div className="text-red-400 text-xs font-mono">
                {aiError}
              </div>
            )}

            <button
              onClick={handleGenerateLyrics}
              disabled={generating}
              className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              {generating ? "Drafting verses with Gemini..." : "Generate Lyrics & Auto-fill Studio Form"}
            </button>
          </div>

          {/* Form to submit tracks */}
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">
                Upload New Studio Track
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Track Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Karachi Chronicles"
                    className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Release Category</label>
                  <select
                    value={formData.type}
                    onChange={(e: any) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-zinc-400 focus:outline-none focus:border-emerald-500/40"
                  >
                    <option value="single">Single</option>
                    <option value="freestyle">Freestyle</option>
                    <option value="collab">Collaborative Verse</option>
                    <option value="verse">Verse Drop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Key Producer / Beatmaker</label>
                  <input
                    type="text"
                    value={formData.producer}
                    onChange={(e) => setFormData((prev) => ({ ...prev, producer: e.target.value }))}
                    placeholder="Shayar"
                    className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Duration (e.g. MM:SS)</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="3:15"
                    className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Track Audio/Soundhelix URL</label>
                <input
                  type="url"
                  required
                  value={formData.audioUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, audioUrl: e.target.value }))}
                  className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-zinc-400 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Primary Hook Highlight Text</label>
                <input
                  type="text"
                  value={formData.hookHighlight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hookHighlight: e.target.value }))}
                  placeholder="e.g. Sarak pe sannata, par zehan mein hai shor..."
                  className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-bold">Full Roman Urdu Lyrics Content</label>
                <textarea
                  value={formData.lyrics}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lyrics: e.target.value }))}
                  placeholder="Paste lyrical blocks here..."
                  rows={6}
                  className="w-full p-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-mono text-zinc-600 uppercase mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
                    placeholder="https://youtube.com/..."
                    className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-zinc-600 uppercase mb-1">Spotify URL</label>
                  <input
                    type="text"
                    value={formData.spotifyUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, spotifyUrl: e.target.value }))}
                    placeholder="https://spotify.com/..."
                    className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-zinc-600 uppercase mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, instagramUrl: e.target.value }))}
                    placeholder="https://instagram.com/..."
                    className="w-full h-10 px-3 bg-zinc-950 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                  {formSuccess}
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-lg">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-11 bg-white hover:bg-emerald-400 hover:text-black text-black font-semibold uppercase tracking-wider text-xs rounded-lg transition-all"
              >
                Publish Track to Vault Catalog
              </button>
            </form>
          </div>
        </div>

        {/* Right 5 Columns: Subscribers list & Real-time platform sync logs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Platform Sync Logs / Webhook representation */}
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase mb-4">
              YouTube Data API Sync Logs
            </span>
            <div className="space-y-4">
              {syncLogs.map((log, i) => (
                <div key={i} className="p-3 bg-zinc-950 border border-white/5 rounded-xl space-y-1.5 text-xs text-zinc-300">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-emerald-400 font-bold">{log.event}</span>
                    <span className="px-2 py-0.5 bg-emerald-900/20 border border-emerald-500/20 font-mono text-[9px] text-emerald-400 rounded">
                      {log.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px]">
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span>{log.viewsUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscribers Interactions List */}
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">
                Mailing List Registered Fans ({subscribers.length})
              </span>
              <Users className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {subscribers.map((sub) => (
                <div key={sub.id} className="p-3 bg-zinc-950 border border-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="text-zinc-200 text-xs font-bold font-sans">{sub.name}</h4>
                    <p className="text-zinc-500 font-mono text-[10px]">{sub.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-mono text-zinc-600 uppercase">PLATFORM</span>
                    <span className="text-[10px] font-mono font-medium text-emerald-400">{sub.preferredPlatform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track Catalog deletion/management */}
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-4 font-bold">
              Database Track Management
            </span>
            <div className="space-y-2.5 max-h-[330px] overflow-y-auto">
              {tracks.map((t) => (
                <div key={t.id} className="p-3 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-xs font-sans font-bold text-white truncate">{t.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Released: {t.releaseDate}</p>
                  </div>
                  <button
                    onClick={() => onDeleteTrack(t.id)}
                    className="p-2.5 bg-red-950/20 hover:bg-red-900/20 text-red-400 rounded-lg border border-red-500/10 transition-colors shrink-0"
                    title="Delete track"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
