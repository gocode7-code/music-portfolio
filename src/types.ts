export interface Track {
  id: string;
  title: string;
  type: "single" | "freestyle" | "collab" | "verse";
  producer: string;
  lyrics: string;
  hookHighlight: string;
  audioUrl: string;
  duration: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  instagramUrl?: string;
  streams: number;
  likes: number;
  releaseDate: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  preferredPlatform: string;
}

export interface AggregatorStats {
  spotifyStreams: number;
  youtubeViews: number;
  instagramFollowers: number;
  subscriberCount: number;
  youtubeSubscriberCount: number;
  lastYoutubeSync: string;
  isSyncing: boolean;
}

export interface SyncLog {
  timestamp: string;
  event: string;
  status: string;
  songsAdded: number;
  viewsUpdated: string;
}

export type ActiveView = "home" | "about" | "songs" | "admin";
