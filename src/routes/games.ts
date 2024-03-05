import { Request, Response } from 'express';
import { getDatabase } from '../lib/db.js';
import {
  createGameValidationMiddleware,
  sanitizationMiddleware,
  validationCheck,
  xssSanitizationMiddleware,
} from '../lib/validation.js';

export async function listGames(req: Request, res: Response) {
  const games = await getDatabase()?.getGames();

  if (!games) {
    return res.status(500).json({ error: 'could not get games' });
  }

  return res.json(games);
}

export async function getGame(req: Request, res: Response) {
  const game = await getDatabase()?.getGame(req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'game not found' });
  }

  return res.json(game);
}

export async function createGameHandler(req: Request, res: Response) {
  const { home, away, home_score, away_score, date } = req.body;

  const createdGame = await getDatabase()?.insertGame({
    home_id: home,
    away_id: away,
    home_score,
    away_score,
    date,
  });

  if (!createdGame) {
    return res.status(500).json({ error: 'could not create game' });
  }

  return res.status(201).json(createdGame);
}

export const createGame = [
  ...createGameValidationMiddleware(),
  ...xssSanitizationMiddleware(),
  validationCheck,
  ...sanitizationMiddleware(),
  createGameHandler,
];

export async function deleteGame(req: Request, res: Response) {
  const deletedGame = await getDatabase()?.deleteGame(req.params.id);

  if (!deletedGame) {
    return res.status(500).json({ error: 'could not delete game' });
  }

  return res.status(204).json({});
}
