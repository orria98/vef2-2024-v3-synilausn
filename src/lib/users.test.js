import { describe, expect, it } from '@jest/globals';
import { comparePasswords } from './users.js';

// Tests use /** @type any */ to allow for testing of partial inputs

describe('users', () => {
  describe('comparePasswords', () => {
    it('should compare passwords and return success if same', async () => {
      const password = '123';

      /** @type any */
      const user = {
        password:
          '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
      };
      const result = await comparePasswords(password, user);
      expect(result).toStrictEqual(user);
    });
    it('should compare passwords and return failure if not same', async () => {
      const password = 'x';

      /** @type any */
      const user = {
        password:
          '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
      };
      const result = await comparePasswords(password, user);
      expect(result).toBe(null);
    });
  });
});
