export enum CategoryKey {
  FAIRY_TALES = 'fairy_tales',
  MUSIC = 'music',
  EDUCATIONAL = 'educational',
  MOVIES = 'movies',
  SERIES = 'series',
  CARTOONS = 'cartoons',
  FAVORITES = 'favorites' // Added for the new category
}

export enum VideoType {
  YOUTUBE = 'youtube',
  MP4 = 'mp4'
}

export interface BaseContent {
  id: string;
  title: string;
  category: CategoryKey;
  thumbnail: string;
}

export interface SingleVideo extends BaseContent {
  contentType: 'video';
  type: VideoType;
  source: string;
}

export interface Episode {
  id: string;
  title: string;
  type: VideoType;
  source: string; // YouTube Video ID or MP4 URL
}

export interface Season {
  season: number;
  episodes: Episode[];
}

export interface Series extends BaseContent {
  contentType: 'series';
  seasons: Season[];
}

export type ContentItem = SingleVideo | Series;
