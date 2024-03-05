export type TeamStanding = {
  position: number;
  name: string;
  points: number;
};

export type Team = {
  name: string;
  description?: string;
  score: number;
};

export type DatabaseTeam = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Game = {
  id?: string;
  date?: Date;
  home: Team;
  away: Team;
};

export type DatabaseGame = {
  id: string;
  date: string;
  home_id: string;
  away_id: string;
  home_score: number;
  away_score: number;
};

export type Gameday = {
  date: Date;
  games: Game[];
};
