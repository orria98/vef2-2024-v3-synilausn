const POINTS_WIN = 3;
const POINTS_DRAW = 1;
const POINTS_LOSS = 0;

/**
 * Create an empty standing for a team.
 * @param {string} name Name of team to create standing for.
 * @returns Team standing.
 */
function setStanding(name) {
  return {
    position: -1,
    name,
    points: 0,
  };
}

/**
 * Calculate team standings from games.
 * @param {Array<import('../types.js').Game>} games
 * @param {number} [limit=Infinity] Limit of standings to return.
 * @returns {Array<import('../types.js').TeamStanding>} Ordered array of team standings.
 */
export function calculateStandings(games, limit = Infinity) {
  if (games.length === 0) {
    return [];
  }

  // Set the type of our object to be a record of name and standing, i.e.
  // `{ teamName: { name: string; points: number; } }`
  /** @type Record<string, import('../types.js').TeamStanding> */
  const standings = {};

  for (const game of games) {
    const {
      home: { name: homeName, score: homeScore },
      away: { name: awayName, score: awayScore },
    } = game;

    if (!standings[homeName]) {
      standings[homeName] = setStanding(homeName);
    }

    if (!standings[awayName]) {
      standings[awayName] = setStanding(awayName);
    }

    if (homeScore > awayScore) {
      standings[homeName].points += POINTS_WIN;
      standings[awayName].points += POINTS_LOSS;
    } else if (homeScore < awayScore) {
      standings[homeName].points += POINTS_LOSS;
      standings[awayName].points += POINTS_WIN;
    } else {
      standings[homeName].points += POINTS_DRAW;
      standings[awayName].points += POINTS_DRAW;
    }
  }

  // `standings` will be an object of format:
  // `{ teamName: { name: string; points: number; } }`
  // but we want to return a sorted array so we need to convert
  const standingsAsArray = Object.values(standings);

  const sorted = standingsAsArray
    .sort((a, b) => b.points - a.points)
    .map((standing, index) => {
      standing.position = index + 1;
      return standing;
    });

  return sorted.slice(0, limit);
}
