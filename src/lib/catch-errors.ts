import { Request, Response, NextFunction } from 'express';

/**
 * Wrap an async function with error handling
 * @params {function} fn Function to wrap
 * @returns {Promise} Promise with error handling
 */
export function catchErrors(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
}
