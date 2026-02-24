export type TimeRange = "short_term" | "medium_term" | "long_term";

export interface AuraSpecUser {
  displayName: string;
  timeRange: TimeRange;
}

export interface AuraSpecGlobal {
  genresTop: string[];
  tempoBpmMean: number;
  energyMean: number;
  valenceMean: number;
  danceabilityMean: number;
  acousticnessMean: number;
  instrumentalnessMean: number;
}

export type PaperStyle = "wheatpaste" | "newsprint" | "risograph";
export type WallStyle = "concrete" | "painted" | "brick";
export type BorderStyle = "gallery_frame" | "minimal_margin" | "full_bleed";
export type Layout = "center_mass" | "diagonal_flow" | "grid_fragments" | "stacked_bands";
export type ShapeLanguage = "hard_edge" | "soft_field" | "linework" | "collage";
export type PosterId = "core" | "energy" | "night" | "wildcard";

export interface AuraSpecComposition {
  layout: Layout;
  shapeLanguage: ShapeLanguage;
  density: number;
  contrast: number;
  motion: number;
}

export interface AuraSpecTexture {
  paperGrain: number;
  wrinkles: number;
  tears: number;
  paste: number;
}

export interface AuraSpecPoster {
  id: PosterId;
  title: string;
  seed: number;
  palette: [string, string, string, string, string, string];
  composition: AuraSpecComposition;
  texture: AuraSpecTexture;
  moodWords: [string, string, string, string, string];
  negative: string[];
  caption: string;
}

export interface AuraSpecSeriesStyle {
  typeface: string;
  paper: PaperStyle;
  wall: WallStyle;
  borderStyle: BorderStyle;
  grain: number;
  inkSpread: number;
  halftone: number;
}

export interface AuraSpec {
  version: string;
  user: AuraSpecUser;
  global: AuraSpecGlobal;
  seriesStyle: AuraSpecSeriesStyle;
  posters: AuraSpecPoster[];
  exhibitionTitle: string;
}

export interface AnalyticsPayload {
  displayName: string;
  timeRange: TimeRange;
  genresTop: string[];
  tempoBpmMean: number;
  energyMean: number;
  valenceMean: number;
  danceabilityMean: number;
  acousticnessMean: number;
  instrumentalnessMean: number;
}
