import express, { Request, Response } from 'express';
import {
  createTeam,
  deleteTeam,
  getTeam,
  listTeams,
  updateTeam,
} from './teams.js';

export const router = express.Router();

export async function index(req: Request, res: Response) {
  return res.json([
    {
      href: '/teams',
      methods: ['GET', 'POST'],
    },
    {
      href: '/teams/:slug',
      methods: ['GET', 'PATCH', 'DELETE'],
    },
    {
      href: '/games',
      methods: ['GET', 'POST'],
    },
    {
      href: '/games/:date',
      methods: ['GET', 'PATCH', 'DELETE'],
    },
  ]);
}

router.get('/', index);

router.get('/teams', listTeams);
router.post('/teams', createTeam);
router.get('/teams/:slug', getTeam);
router.patch('/teams/:slug', updateTeam);
router.delete('/teams/:slug', deleteTeam);
