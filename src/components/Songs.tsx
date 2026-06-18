import React, { useState, useMemo } from "react";
import { Search, Play, Volume2, Youtube, Instagram, Headphones, Disc, Bookmark, Check, Layers, AlertCircle } from "lucide-react";
import { Track } from "../types";

interface SongsProps {
  tracks: Track[];
  activeTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
}

export default function Songs({ tracks, activeTrack, isPlaying, onPlayTrack }: SongsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLyricsTrack, setSelectedLyricsTrack] = useState<Track | null>(null);

  // Initialize selectedLyricsTrack with the first track or active track
  React.useEffect(() => {
    if (tracks.length > 0 && !selectedLyricsTrack) {
      setSelectedLyricsTrack(tracks[0]);
    }
  }, [tracks, selectedLyricsTrack]);

  // Filtering Logic
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchQuery = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          track.lyrics.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          track.producer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchType = selectedType === "all" || track.type === selectedType;
      
      return matchQuery && matchType;
    });
  }, [tracks, searchQuery, selectedType]);

  const formattedStreams = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div id="catalog-view" className="space-y-10 animate-fade-in relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full"></div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-500 font-bold block mb-1">THE DIRECTIVE VAULT</span>
          <h2 className="text-4xl font-sans font-black uppercase italic text-white">The Catalog</h2>
          <p className="text-xs font-mono text-emerald-400 mt-1">
            {tracks.length} OFFICIAL TRACKS REELED &middot; {selectedType.toUpperCase()} SELECTION
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-2">
          {["all", "single", "freestyle", "collab", "verse"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wider border transition-all ${
                selectedType === type
                  ? "bg-emerald-600/30 text-emerald-400 border-emerald-500/40 text-cyber-glow"
                  : "bg-transparent text-zinc-500 border-white/5 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Searching + Layout Column split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Tracklist list & search interface */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by track title, producers or lyrics..."
              className="w-full h-11 pl-11 pr-4 bg-zinc-900/40 border border-white/5 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40 transition-all font-sans"
            />
          </div>

          <div className="space-y-3">
            {filteredTracks.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 border border-white/5 rounded-xl space-y-3">
                <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-zinc-500 text-sm font-mono">No matching streams located. Refine your keywords.</p>
              </div>
            ) : (
              filteredTracks.map((track) => {
                const isActive = activeTrack?.id === track.id;
                const isLyricsSelected = selectedLyricsTrack?.id === track.id;

                return (
                  <div
                    key={track.id}
                    className={`p-4 bg-zinc-900/40 border rounded-xl hover:bg-zinc-900/60 transition-all flex items-center justify-between gap-4 group ${
                      isActive ? "border-emerald-500/30 bg-emerald-950/10" : "border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Play trigger button inside item */}
                      <button
                        onClick={() => onPlayTrack(track)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                          isActive && isPlaying
                            ? "bg-emerald-400 text-black border-emerald-400 shadow-md shadow-emerald-500/20"
                            : "bg-zinc-800 text-zinc-400 border-white/5 group-hover:text-emerald-400 group-hover:border-emerald-500/30"
                        }`}
                      >
                        <Play className={`w-4 h-4 ${isActive && isPlaying ? "fill-black animate-pulse" : "fill-current"}`} />
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-bold transition-colors truncate text-sm md:text-base ${isActive ? 'text-emerald-400' : 'text-zinc-100'}`}>
                            {track.title}
                          </h4>
                          <span className="px-1.5 py-0.5 bg-white/5 text-[9px] font-mono text-zinc-500 rounded border border-white/5 uppercase shrink-0">
                            {track.type}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-xs font-mono truncate">
                          Prod. by {track.producer} &bull; {track.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Interaction metrics & quick platform link */}
                      <div className="text-right hidden sm:block">
                        <span className="block text-[8px] font-mono text-zinc-500 uppercase">STREAMS</span>
                        <span className="text-xs font-mono text-zinc-300">{formattedStreams(track.streams)}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedLyricsTrack(track)}
                          className={`h-8 px-2.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                            isLyricsSelected
                              ? "bg-emerald-900/20 text-emerald-300 border-emerald-500/30"
                              : "bg-transparent text-zinc-500 border-white/5 hover:text-zinc-300"
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Lyrics</span>
                        </button>

                        <button
                          onClick={() => onPlayTrack(track)}
                          className={`h-8 px-3 rounded-lg text-xs font-mono uppercase bg-zinc-800 hover:bg-zinc-700 transition-colors ${
                            isActive ? "text-emerald-400" : "text-zinc-400"
                          }`}
                        >
                          {isActive && isPlaying ? "Playing" : "Load"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Lyrics Drawer Sheet */}
        <div className="lg:col-span-5">
          {selectedLyricsTrack ? (
            <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md space-y-6">
              {/* Cover info */}
              <div className="border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold mb-1">
                  OFFICIAL LYRICS SHEET
                </span>
                <h3 className="text-2xl font-display font-black text-white uppercase italic leading-none truncate">
                  {selectedLyricsTrack.title}
                </h3>
                <p className="text-zinc-500 text-xs font-mono mt-1 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  Written & Performed by Shayar
                </p>
              </div>

              {/* Highlight box */}
              {selectedLyricsTrack.hookHighlight && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/25 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    <Layers className="w-3.5 h-3.5" />
                    Hook / Main Verse Highlight
                  </div>
                  <blockquote className="text-xs md:text-sm text-zinc-200 font-sans italic pl-2.5 border-l-2 border-emerald-400">
                    "{selectedLyricsTrack.hookHighlight}"
                  </blockquote>
                </div>
              )}

              {/* Raw scrollable lyrics */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 max-h-[340px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm text-zinc-400 leading-relaxed font-medium">
                  {selectedLyricsTrack.lyrics || "No official lyrics loaded for this track."}
                </pre>
              </div>

              {/* Stream handles */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">STREAM CHANNELS</span>
                <div className="flex gap-2">
                  {selectedLyricsTrack.youtubeUrl && (
                    <a
                      href={selectedLyricsTrack.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-red-650 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-white/5 text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Youtube className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400" />
                      YouTube
                    </a>
                  )}
                  {selectedLyricsTrack.spotifyUrl && (
                    <a
                      href={selectedLyricsTrack.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-650 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-white/5 text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Disc className="w-3.5 h-3.5 text-zinc-500" />
                      Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl text-center text-zinc-500">
              Select or load a track to read lyrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
