import { Game, Gameday, Team } from '../types.js';
import { ILogger } from './logger.js';

/**
 * Parse a JSON string and try and get an array of team names as strings.
 * Throws if error happens.
 * @throws {Error} If unable to parse JSON.
 * @param data Potential team data.
 * @returns Array of team names, empty if no data.
 */
export function parseTeamsJson(data: string): Array<string> {
  // Explicitly set type to `unknown` instead of the implicit `any` from
  // JSON.parse. This is because we want to check the type of the parsed string.
  let teamsParsed;
  try {
    teamsParsed = JSON.parse(data);
  } catch (e) {
    throw new Error('unable to parse teams data');
  }

  const teams = [];

  // Since we don't know what the data is we need to jump through some hoops to
  // check that it's an array and that it contains strings.
  if (Array.isArray(teamsParsed)) {
    for (const team of teamsParsed) {
      if (typeof team === 'string') {
        teams.push(team);
      }
    }
  } else {
    throw new Error('teams data is not an array');
  }

  return teams;
}

/**
 * Parse team data. Skips illegal data.
 * @param data Potential team data.
 * @param logger Logger instance.
 * @param teams Array of team names.
 * @returns Team object.
 */
export function parseTeam(
  data: unknown,
  logger: ILogger,
  teams: Array<string> = [],
): Team | null {
  if (typeof data !== 'object' || !data) {
    // This is a bit annoying in our test output! How should we fix it?
    logger.warn('illegal team object', data);
    return null;
  }

  // More hoops to jump through to check that the data is what we expect.
  // First we need to check that the object has a `name` property and that it's
  // a string. Then we need to check that the name is in the teams array.
  // If we have `js check` enabled and uncomment the first check, we'll get a
  // type error on the second check (`typoef data.name !== 'string'`) since we
  // don't know that `data` has a `name` property.
  if (
    !('name' in data) ||
    typeof data.name !== 'string' ||
    !teams.includes(data.name)
  ) {
    logger.warn('illegal team data', data);
    return null;
  }

  if (!('score' in data) || typeof data.score !== 'number' || data.score < 0) {
    logger.warn('illegal team data', data);
    return null;
  }

  return {
    name: data.name,
    score: data.score,
  };
}

/**
 * Parse game data.
 * @param data Potential game data.
 * @param logger Logger instance.
 * @param teams Array of team names.
 */
export function parseGamedayGames(
  data: unknown,
  logger: ILogger,
  teams: Array<string> = [],
): Game[] {
  const games = [];

  if (!Array.isArray(data)) {
    return [];
  }

  for (const game of data) {
    if (typeof game !== 'object' || !game) {
      throw new Error('game data is not an object');
    }

    if (!('home' in game) || !('away' in game)) {
      throw new Error('game data does not have home and away');
    }

    const home = parseTeam(game.home, logger, teams);
    const away = parseTeam(game.away, logger, teams);

    if (home && away) {
      games.push({
        home,
        away,
      });
    }
  }

  return games;
}

/**
 * Parse a JSON string and try and get an array of game days.
 * @throws If unable to parse JSON.
 * @param data Potential gameday data.
 * @param logger Logger instance.
 * @param teams Array of team names.
 * @returns Gameday object.
 */
export function parseGamedayFile(
  data: string,
  logger: ILogger,
  teams: Array<string> = [],
): Gameday {
  // Again, explicitly set type to `unknown` instead of the implicit `any`.
  let gamedayParsed: unknown;

  try {
    gamedayParsed = JSON.parse(data);
  } catch (e) {
    throw new Error('unable to parse gameday data');
  }

  if (typeof gamedayParsed !== 'object' || !gamedayParsed) {
    throw new Error('gameday data is not an object');
  }

  if (!('date' in gamedayParsed) || typeof gamedayParsed.date !== 'string') {
    throw new Error('gameday data does not have date');
  }

  const date = new Date(gamedayParsed.date);

  // `new Date` returns `Invalid Date` if it can't parse the string so we need
  // to check that the created date is valid.
  if (Number.isNaN(date.valueOf())) {
    throw new Error('gameday data date is invalid');
  }

  if (!('games' in gamedayParsed) || !Array.isArray(gamedayParsed.games)) {
    throw new Error('gameday data does not have games array');
  }

  return {
    date,
    games: parseGamedayGames(gamedayParsed.games, logger, teams),
  };
}
