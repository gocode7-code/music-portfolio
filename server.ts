import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-Memory Database (Seeded with Hustlers track catalog)
let tracks = [
  {
    id: "track-1",
    title: "Karachi Chronicles",
    type: "single",
    producer: "Shayar",
    lyrics: `[Verse 1: Shayar]\nSarak pe sannata, par zehan mein hai shor\nKalam uthata main, jab soti hai yeh bhor\nKarachi ki galiyon se uthi hai yeh sada\nHusn hai fareb yahan, dushman hai har jada\nDhuan hai hawa mein, par dil hai saaf mera\nKalam mere sath khari, badla hai taqdeer ka ghera...\n\n[Hook]\nHum hain Hustlers, na rukein hai na thamein hai\nChhoti jagah se uth ke baray khwab bunay hain\nShor tha zamana, par hum ne kab sunay hain\nHustlers dilon mein, yeh jazbe hi sunehra hain...\n\n[Verse 2: Shayar]\nHar ik lafz yahan aag ban ke nikalta\nZameer zinda hai mera, saaya bhi nahi dalta\nUnderground ka scene ab hamara mukaddar\nKhone ko kuch nahi, paana hai samandar!`,
    hookHighlight: "Hum hain Hustlers, na rukein hai na thamein hai",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:12",
    youtubeUrl: "https://youtube.com/watch?v=mock_chronicles",
    spotifyUrl: "https://spotify.com/track/mock_chronicles",
    instagramUrl: "https://instagram.com/p/mock_chronicles",
    streams: 45200,
    likes: 8340,
    releaseDate: "2026-03-10",
  },
  {
    id: "track-2",
    title: "Gully Flow (Freestyle)",
    type: "freestyle",
    producer: "Shayar",
    lyrics: `[Intro: Shayar]\nYeah, Hustlers back in the booth!\nRasta dikha inhein. Let's go.\n\n[Verse 1: Shayar]\nBina beat ke bhi flow mera qaatil\nJo sochte the humein nahi milegi manzil\nUnki bolti hai band, ab kalam meri chalti\nGully se seedha stage, yeh hai hustle ki tajalli\nHar sher hai gehra, har beat hai bhari\nHamari yeh kahani ab lagti hai pyari...`,
    hookHighlight: "Gully se seedha stage, yeh hai hustle ki tajalli!",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "2:05",
    youtubeUrl: "https://youtube.com/watch?v=mock_gullyflux",
    spotifyUrl: "https://spotify.com/track/mock_gullyflux",
    instagramUrl: "https://instagram.com/p/mock_gullyflux",
    streams: 28900,
    likes: 4120,
    releaseDate: "2026-04-05",
  },
  {
    id: "track-3",
    title: "Zindagi (Collaborative)",
    type: "collab",
    producer: "Shayar",
    lyrics: `[Verse 1: Shayar]\nKhowab the baray aur raste the tang\nZindagi ne hum se lari har ik jung\nPar hum ne seekha hai gir ke sambhalna\nAndheri raatun se seekha nikalna\nMaine khud banayi beat, maine likha naghma\nHamare naam ka ab chalta hai dabdaba...\n\n[Hook]\nZindagi jo kheti hai woh khel ke dikhayenge\nHum hi is kissa-e-raah ke badshah kehlayenge!\n\n[Verse 2: Shayar]\nBeat pe jab aaoon toh dunya hil jayi\nMera rap hai tohfa, qeemat kaun lagaye?\nHustlers hain kharay, dunya pichay reh gayi\nHar ik saaz yahan hamari dastaan keh gayi!`,
    hookHighlight: "Zindagi jo kheti hai woh khel ke dikhayenge!",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "3:45",
    youtubeUrl: "https://youtube.com/watch?v=mock_zindagi",
    spotifyUrl: "https://spotify.com/track/mock_zindagi",
    instagramUrl: "https://instagram.com/p/mock_zindagi",
    streams: 61400,
    likes: 12900,
    releaseDate: "2026-05-20",
  },
];

// In-Memory Subscriber List
let subscribers = [
  { id: "sub-1", name: "Ahmed Khan", email: "ahmed.k33@gmail.com", joinedDate: "2026-06-10", preferredPlatform: "Spotify" },
  { id: "sub-2", name: "Zainab Malik", email: "zainab_m@yahoo.com", joinedDate: "2026-06-12", preferredPlatform: "YouTube" },
  { id: "sub-3", name: "Hamza Shah", email: "hamzashah@live.com", joinedDate: "2026-06-15", preferredPlatform: "Instagram" },
];

// Unified Feed Stats
let aggregatorStats = {
  spotifyStreams: 135500,
  youtubeViews: 245000,
  instagramFollowers: 18900,
  subscriberCount: 3840,
  youtubeSubscriberCount: 15400,
  lastYoutubeSync: "2026-06-18T08:00:00-07:00",
  isSyncing: false,
};

// Sync logs
let syncLogs = [
  { timestamp: "2026-06-18T08:00:00-07:00", event: "Automated cron check", status: "Success", songsAdded: 0, viewsUpdated: "+1,240 Views" },
  { timestamp: "2026-06-17T08:00:00-07:00", event: "Automated cron check", status: "Success", songsAdded: 1, viewsUpdated: "+2,890 Views (Track-3 added)" },
];

/* 
=================== API ROUTE HANDLERS ===================
*/

// Serve custom uploaded branding assets
app.get("/input_file_0.png", (req, res) => {
  res.sendFile(path.join(process.cwd(), "input_file_0.png"), (err) => {
    if (err) {
      res.sendFile("/input_file_0.png", (err2) => {
        if (err2) {
          res.status(404).send("Logo not found");
        }
      });
    }
  });
});

app.get("/input_file_1.png", (req, res) => {
  res.sendFile(path.join(process.cwd(), "input_file_1.png"), (err) => {
    if (err) {
      res.sendFile("/input_file_1.png", (err2) => {
        if (err2) {
          res.status(404).send("Banner not found");
        }
      });
    }
  });
});

// GET aggregate stats
app.get("/api/aggregator/stats", (req, res) => {
  res.json(aggregatorStats);
});

// GET sync logs
app.get("/api/aggregator/logs", (req, res) => {
  res.json(syncLogs);
});

// TRIGGER a mock YouTube Sync
app.post("/api/aggregator/sync", (req, res) => {
  aggregatorStats.isSyncing = true;
  
  setTimeout(() => {
    aggregatorStats.isSyncing = false;
    aggregatorStats.youtubeViews += 4520;
    aggregatorStats.spotifyStreams += 3100;
    aggregatorStats.lastYoutubeSync = new Date().toISOString();
    
    // Check if there is a "new" song on YouTube to auto-inject (simulating webhook/polling drop)
    const hasNewSong = !tracks.some(t => t.id === "track-4");
    let songsAdded = 0;
    if (hasNewSong) {
      tracks.push({
        id: "track-4",
        title: "Hustlers Movement (YT Drop)",
        type: "verse",
        producer: "Shayar",
        lyrics: `[Intro: Shayar]\nUnderground se raw talent, YouTube exclusive drop!\nHustlers on top. Let's get it.\n\n[Verse 1: Shayar]\nHar gali ka larka gaaye yehi naghma\nHum ne dunya badli, badla har saaz\nMera beat baje, badalta hai mizaaj\nKal jo dushman the, aaj hain dildaar\nHustlers movement, ab hai saray aam!\n\n[Hook]\nHum hain Hustlers, na rukein hai na thamein hai\nChhoti jagah se uth ke baray khwab bunay hain!`,
        hookHighlight: "Hustlers movement, ab hai saray aam!",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        duration: "2:40",
        youtubeUrl: "https://youtube.com/watch?v=mock_ytdrop",
        spotifyUrl: "",
        instagramUrl: "",
        streams: 1500,
        likes: 420,
        releaseDate: new Date().toISOString().split("T")[0],
      });
      songsAdded = 1;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      event: "Manual YouTube Sync triggered",
      status: "Success",
      songsAdded,
      viewsUpdated: `+4,520 Views${songsAdded ? " (New Release Synced!)" : ""}`,
    };
    syncLogs.unshift(logEntry);

    res.json({
      success: true,
      stats: aggregatorStats,
      logs: syncLogs,
      tracks: tracks,
    });
  }, 1500);
});

// GET all tracks
app.get("/api/tracks", (req, res) => {
  res.json(tracks);
});

// CREATE / UPLOAD custom track (Admin only)
app.post("/api/tracks", (req, res) => {
  const { title, type, producer, lyrics, hookHighlight, audioUrl, duration, youtubeUrl, spotifyUrl, instagramUrl } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTrack = {
    id: `track-${Date.now()}`,
    title,
    type: type || "single",
    producer: producer || "Shayar",
    lyrics: lyrics || "",
    hookHighlight: hookHighlight || "",
    audioUrl: audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: duration || "3:00",
    youtubeUrl: youtubeUrl || "",
    spotifyUrl: spotifyUrl || "",
    instagramUrl: instagramUrl || "",
    streams: 0,
    likes: 0,
    releaseDate: new Date().toISOString().split("T")[0],
  };

  tracks.unshift(newTrack);
  res.status(201).json(newTrack);
});

// DELETE a track (Admin only)
app.delete("/api/tracks/:id", (req, res) => {
  const { id } = req.params;
  const index = tracks.findIndex(t => t.id === id);
  if (index !== -1) {
    tracks.splice(index, 1);
    res.json({ success: true, message: "Track deleted successfully" });
  } else {
    res.status(404).json({ error: "Track not found" });
  }
});

// GET all subscribers (Admin only)
app.get("/api/subscribers", (req, res) => {
  res.json(subscribers);
});

// SUBSCRIBE to newsletter / interactions mapping
app.post("/api/subscribers", (req, res) => {
  const { name, email, preferredPlatform } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  // Check if already subscribed
  const exists = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: "Email is already registered on the movement's mailing list!" });
  }

  const newSub = {
    id: `sub-${Date.now()}`,
    name,
    email,
    joinedDate: new Date().toISOString().split("T")[0],
    preferredPlatform: preferredPlatform || "Spotify",
  };

  subscribers.unshift(newSub);
  aggregatorStats.subscriberCount += 1;

  res.status(201).json({ success: true, subscriber: newSub });
});

// AI ENGINE: Generate Rap verses & Hooks using Gemini API (Lazily handled, returns rich structure)
app.post("/api/lyrics/generate", async (req, res) => {
  const { prompt, beatVibe, length } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Context or prompt is required for the lyrics writer." });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a legendary underground hip-hop lyricist and producer named Shayar, the sole mastermind behind the Hustlers movement in Karachi. 
Your rap style is sharp, lyrical, deep, poetic of street realities ("Karachi Nightlife", struggle, small rooms with big dreams, hustling, absolute genuine fire flows). 
You write lyrics in Roman Urdu / Hindi mixed with English keywords (real underground rap vibe).
Generate a custom track layout. Return the response in a structured JSON schema conforming in layout:
{
  "title": "A gritty, raw Urdu hip-hop track title",
  "beatVibe": "Beat outline and drum speed",
  "lyrics": "Beautiful lyrics formatted with tags like [Intro: Shayar], [Verse 1: Shayar], [Hook], [Verse 2: Shayar], [Outro]",
  "hookHighlight": "The most addictive hook or main line"
}`;

    const promptMessage = `Theme/Keywords: "${prompt}". Beat vibes requested: "${beatVibe || "Gritty dark 90s boom bap"}". Generate lyrics of length: "${length || "regular"}". Ensure to write authentic, hard-hitting Roman Urdu underground bars. Make the rhymes incredibly clean and catchy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.85,
      },
    });

    const outputText = response.text || "{}";
    const generatedData = JSON.parse(outputText.trim());
    res.json(generatedData);
  } catch (error: any) {
    console.error("Gemini lyrics generation error:", error);
    res.status(500).json({ 
      error: "Lyrics Assistant went offline or API key is not configured.", 
      details: error.message 
    });
  }
});


// Server setup with Vite integration
async function startServer() {
  // Integrate Vite for asset serving in Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Music Verse] Server running securely on http://localhost:${PORT}`);
  });
}

startServer();
