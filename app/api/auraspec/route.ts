import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import type { AuraSpec, AnalyticsPayload, TimeRange } from "@/types/auraspec";
import type {
  SpotifyTopTracksResponse,
  SpotifyTopArtistsResponse,
  SpotifyAudioFeaturesResponse,
} from "@/types/spotify";

const SPOTIFY_BASE = "https://api.spotify.com/v1";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const SYSTEM_MESSAGE = `You are AURAPOSTER, an art director that converts Spotify listening analytics into a strict JSON art specification for abstract wheatpasted posters.
Output MUST be valid JSON only. No markdown. No prose. No code fences.
Never include literal imagery instructions (no instruments, faces, artists, logos, album covers, readable text).
All poster designs must feel like print posters wheatpasted on a wall: paper edges, paste halo, slight wear, subtle grain.
Use Futura as the typeface reference in the spec.
Ensure the four posters are distinct but belong to one cohesive series.
Use hex colors. Use numeric values 0.0–1.0 where specified.
If input data is sparse, infer reasonable defaults while remaining consistent with the data.`;

const DEVELOPER_MESSAGE = `Return a single AuraSpec JSON object with this structure:

{
  "version": "1.0",
  "user": { "displayName": "string", "timeRange": "short_term|medium_term|long_term" },
  "global": {
    "genresTop": ["string"],
    "tempoBpmMean": number,
    "energyMean": number,
    "valenceMean": number,
    "danceabilityMean": number,
    "acousticnessMean": number,
    "instrumentalnessMean": number
  },
  "seriesStyle": {
    "typeface": "Futura",
    "paper": "wheatpaste|newsprint|risograph",
    "wall": "concrete|painted|brick",
    "borderStyle": "gallery_frame|minimal_margin|full_bleed",
    "grain": number,
    "inkSpread": number,
    "halftone": number
  },
  "posters": [
    {
      "id": "core|energy|night|wildcard",
      "title": "CORE AURA|ENERGY SELF|NIGHT SELF|WILDCARD EDGE",
      "seed": number,
      "palette": ["#RRGGBB","#RRGGBB","#RRGGBB","#RRGGBB","#RRGGBB","#RRGGBB"],
      "composition": {
        "layout": "center_mass|diagonal_flow|grid_fragments|stacked_bands",
        "shapeLanguage": "hard_edge|soft_field|linework|collage",
        "density": number,
        "contrast": number,
        "motion": number
      },
      "texture": {
        "paperGrain": number,
        "wrinkles": number,
        "tears": number,
        "paste": number
      },
      "moodWords": ["string","string","string","string","string"],
      "negative": ["text","logos","faces","instruments","album cover"],
      "caption": "short exhibition-style label"
    }
  ],
  "exhibitionTitle": "string"
}

Rules:
- posters array MUST contain exactly 4 objects in this order: core, energy, night, wildcard.
- palette MUST contain exactly 6 hex colors.
- numeric params must be 0.0–1.0 except seed (integer).
- Map listening stats into design:
    higher tempo/energy -> higher motion/contrast
    lower valence -> darker palette bias
    higher acousticness -> softer fields/less contrast
    higher instrumentalness -> more abstract/linework/collage
    higher danceability -> stronger diagonal or rhythmic layout
- Generate an exhibitionTitle in ALL CAPS with a slash.
- Captions must be <= 12 words.
- Do not reference specific artists or track names.`;

function buildUserMessage(payload: AnalyticsPayload): string {
  return `Create an AuraSpec using this analytics payload:
${JSON.stringify(payload, null, 2)}`;
}

async function fetchSpotify<T>(
  accessToken: string,
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(path, SPOTIFY_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Spotify API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function topGenresFromArtists(artists: SpotifyTopArtistsResponse["items"], limit: number): string[] {
  const counts = new Map<string, number>();
  for (const artist of artists) {
    for (const g of artist.genres) {
      const normalized = g.trim().toLowerCase();
      if (normalized) counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre]) => genre);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.accessToken;
    if (!accessToken || typeof accessToken !== "string") {
      return Response.json(
        { error: "No Spotify access token; re-authenticate." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get("time_range") ?? "medium_term") as TimeRange;
    if (!["short_term", "medium_term", "long_term"].includes(timeRange)) {
      return Response.json({ error: "Invalid time_range" }, { status: 400 });
    }

    const [tracksRes, artistsRes] = await Promise.all([
      fetchSpotify<SpotifyTopTracksResponse>(accessToken, "/me/top/tracks", {
        limit: "50",
        time_range: timeRange,
      }),
      fetchSpotify<SpotifyTopArtistsResponse>(accessToken, "/me/top/artists", {
        limit: "50",
        time_range: timeRange,
      }),
    ]);

    const trackIds = tracksRes.items.map((t) => t.id).filter(Boolean);
    if (trackIds.length === 0) {
      return Response.json(
        { error: "No top tracks available for this time range." },
        { status: 400 }
      );
    }

    const featuresRes = await fetchSpotify<SpotifyAudioFeaturesResponse>(
      accessToken,
      "/audio-features",
      { ids: trackIds.join(",") }
    );

    const features = (featuresRes.audio_features ?? []).filter(
      (f): f is NonNullable<typeof f> => f != null
    );
    const genresTop = topGenresFromArtists(artistsRes.items, 10);
    const tempoBpmMean = mean(features.map((f) => f.tempo));
    const energyMean = mean(features.map((f) => f.energy));
    const valenceMean = mean(features.map((f) => f.valence));
    const danceabilityMean = mean(features.map((f) => f.danceability));
    const acousticnessMean = mean(features.map((f) => f.acousticness));
    const instrumentalnessMean = mean(features.map((f) => f.instrumentalness));

    const displayName =
      session.user.name ?? session.user.email ?? "Listener";
    const payload: AnalyticsPayload = {
      displayName,
      timeRange,
      genresTop,
      tempoBpmMean,
      energyMean,
      valenceMean,
      danceabilityMean,
      acousticnessMean,
      instrumentalnessMean,
    };

    const openaiKey = process.env.OPENAI_API_KEY;
    const openaiModel = process.env.OPENAI_MODEL ?? "gpt-4o";
    if (!openaiKey) {
      return Response.json(
        { error: "Server misconfiguration: OPENAI_API_KEY not set." },
        { status: 500 }
      );
    }

    const openaiBody = {
      model: openaiModel,
      input: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "developer", content: DEVELOPER_MESSAGE },
        { role: "user", content: buildUserMessage(payload) },
      ],
      text: {
        format: { type: "json_object" as const },
      },
    };

    const openaiRes = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(openaiBody),
    });

    if (!openaiRes.ok) {
      const errBody = await openaiRes.text();
      return Response.json(
        { error: `OpenAI API error ${openaiRes.status}: ${errBody}` },
        { status: 502 }
      );
    }

    const openaiData = (await openaiRes.json()) as {
      output?: Array<{
        type?: string;
        content?: Array<{ type?: string; text?: string }>;
      }>;
    };

    let rawText = "";
    const output = openaiData.output ?? [];
    for (const item of output) {
      const content = item.content ?? [];
      for (const block of content) {
        if (block.type === "output_text" && typeof block.text === "string") {
          rawText += block.text;
        }
      }
    }

    const trimmed = rawText.trim();
    if (!trimmed) {
      return Response.json(
        { error: "OpenAI returned no text content." },
        { status: 500 }
      );
    }

    let spec: unknown;
    try {
      spec = JSON.parse(trimmed) as unknown;
    } catch {
      return Response.json(
        { error: "OpenAI response was not valid JSON." },
        { status: 500 }
      );
    }

    if (spec === null || typeof spec !== "object" || Array.isArray(spec)) {
      return Response.json(
        { error: "OpenAI response was not a JSON object." },
        { status: 500 }
      );
    }

    const auraSpec = spec as AuraSpec;
    return Response.json(auraSpec);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
