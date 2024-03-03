import { describe, expect, it, jest } from '@jest/globals';
import {
  parseGamedayFile,
  parseGamedayGames,
  parseTeam,
  parseTeamsJson,
} from './parse.js';

describe('parse', () => {
  /** @type import('./logger.js').Logger */
  const mockLogger = {
    silent: true,
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  describe('parseTeamsJson', () => {
    it('should return empty array if no data', () => {
      const result = parseTeamsJson('[]');

      expect(result).toEqual([]);
    });

    it('should throw if invalid JSON', () => {
      expect(() => {
        parseTeamsJson('asdf');
      }).toThrow('unable to parse teams data');
    });

    it('should throw if data is not an array', () => {
      expect(() => {
        parseTeamsJson('{}');
      }).toThrow('teams data is not an array');
    });

    it('should parse valid JSON', () => {
      const result = parseTeamsJson('["asdf"]');

      expect(result).toEqual(['asdf']);
    });

    it('should parse and only return strings', () => {
      const result = parseTeamsJson('[1, "asdf", true, {}]');

      expect(result).toEqual(['asdf']);
    });
  });

  describe('parseTeam', () => {
    it('should return null if data is not an object', () => {
      const result = parseTeam('', mockLogger);

      expect(result).toEqual(null);
    });

    it('should return null if data does not have name', () => {
      const result = parseTeam({}, mockLogger);

      expect(result).toEqual(null);
    });

    it('should return null if data does not have score', () => {
      const result = parseTeam({ name: 'x' }, mockLogger, ['x']);

      expect(result).toEqual(null);
    });

    it('should return null if data name is not a string', () => {
      const result = parseTeam({ name: 0, score: 0 }, mockLogger);

      expect(result).toEqual(null);
    });

    it('should return null if data score is not a number', () => {
      const result = parseTeam({ name: 'asdf', score: '0' }, mockLogger);

      expect(result).toEqual(null);
    });

    it('should parse valid data', () => {
      const result = parseTeam({ name: 'asdf', score: 0 }, mockLogger, [
        'asdf',
      ]);

      expect(result).toEqual({ name: 'asdf', score: 0 });
    });

    it('should parse valid data with teams but skip if not allowed team name', () => {
      const result = parseTeam({ name: 'asdf', score: 0 }, mockLogger, ['foo']);

      expect(result).toEqual(null);
    });
  });

  describe('parseGamedayGames', () => {
    it('should throw if data is not an array of objects', () => {
      expect(() => {
        parseGamedayGames([''], mockLogger);
      }).toThrow('game data is not an object');
    });

    it('should throw if data is missing home or away', () => {
      expect(() => {
        parseGamedayGames([{ home: {} }], mockLogger);
      }).toThrow('game data does not have home and away');
    });

    it('should return empty array if data is not an array of objects with home and away', () => {
      const result = parseGamedayGames([{ home: {}, away: {} }], mockLogger);

      expect(result).toEqual([]);
    });

    it('should not return a game if home or away is not valid', () => {
      const result = parseGamedayGames(
        [{ home: { name: 'foo', score: 0 }, away: { name: 'bar', score: 0 } }],
        mockLogger,
        ['asdf'],
      );

      expect(result).toEqual([]);
    });

    it('should not return a game if home or away team has negative score', () => {
      const result = parseGamedayGames(
        [{ home: { name: 'foo', score: -1 }, away: { name: 'bar', score: 0 } }],
        mockLogger,
        ['foo', 'bar'],
      );

      expect(result).toEqual([]);
    });

    it('should parse valid data', () => {
      const result = parseGamedayGames(
        [{ home: { name: 'foo', score: 0 }, away: { name: 'bar', score: 0 } }],
        mockLogger,
        ['foo', 'bar'],
      );

      expect(result).toEqual([
        { home: { name: 'foo', score: 0 }, away: { name: 'bar', score: 0 } },
      ]);
    });
  });

  describe('parseGamedayFile', () => {
    it('should throw if data is not an object', () => {
      expect(() => {
        parseGamedayFile('', mockLogger);
      }).toThrow('unable to parse gameday data');
    });

    it('should throw if data is not an object', () => {
      expect(() => {
        parseGamedayFile('1', mockLogger);
      }).toThrow('gameday data is not an object');
    });

    it('should throw if data is missing date', () => {
      expect(() => {
        parseGamedayFile('{}', mockLogger);
      }).toThrow('gameday data does not have date');
    });

    it('should throw if date is invalid', () => {
      expect(() => {
        parseGamedayFile('{ "date": "foo" }', mockLogger);
      }).toThrow('gameday data date is invalid');
    });

    it('should throw if games is not an array', () => {
      expect(() => {
        parseGamedayFile('{ "date": "2020-01-01", "games": {} }', mockLogger);
      }).toThrow('gameday data does not have games array');
    });

    it('should parse valid data', () => {
      const data = {
        date: new Date(),
        games: [
          {
            home: { name: 'foo', score: 0 },
            away: { name: 'bar', score: 0 },
          },
        ],
      };
      const result = parseGamedayFile(JSON.stringify(data), mockLogger, [
        'foo',
        'bar',
      ]);

      expect(result).toStrictEqual(data);
    });
  });
});
