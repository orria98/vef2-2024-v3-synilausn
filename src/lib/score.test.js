import { describe, expect, it } from '@jest/globals';
import { calculateStandings } from './score';

describe('score', () => {
  describe.only('calculateStandings', () => {
    it('should return empty array if no data', () => {
      const result = calculateStandings([]);

      expect(result).toEqual([]);
    });

    it('should return standing for multiple games', () => {
      const result = calculateStandings([
        {
          home: { name: 'a', score: 2 },
          away: { name: 'b', score: 1 },
        },
        {
          home: { name: 'a', score: 1 },
          away: { name: 'b', score: 1 },
        },
        {
          home: { name: 'a', score: 1 },
          away: { name: 'c', score: 10 },
        },
        {
          home: { name: 'c', score: 2 },
          away: { name: 'b', score: 1 },
        },
      ]);

      expect(result).toEqual([
        {
          position: 1,
          name: 'c',
          points: 6,
        },
        {
          position: 2,
          name: 'a',
          points: 4,
        },
        {
          position: 3,
          name: 'b',
          points: 1,
        },
      ]);
    });
  });
});
