export interface SpotifyTopTracksResponse {
  items: Array<{
    id: string;
    name: string;
    artists: Array<{ id: string; name: string }>;
  }>;
}

export interface SpotifyTopArtistsResponse {
  items: Array<{
    id: string;
    name: string;
    genres: string[];
  }>;
}

export interface SpotifyAudioFeaturesResponse {
  audio_features: Array<{
    id: string;
    tempo: number;
    energy: number;
    valence: number;
    danceability: number;
    acousticness: number;
    instrumentalness: number;
  } | null>;
}
