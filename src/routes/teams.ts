import { NextFunction, Request, Response } from 'express';

import slugify from 'slugify';
import { getDatabase } from '../lib/db.js';
import {
  atLeastOneBodyValueValidator,
  genericSanitizer,
  stringValidator,
  teamDoesNotExistValidator,
  validationCheck,
  xssSanitizer,
} from '../lib/validation.js';

export async function listTeams(req: Request, res: Response) {
  const teams = await getDatabase()?.getTeams();

  if (!teams) {
    return res.status(500).json({ error: 'Could not get teams' });
  }

  return res.json(teams);
}

export async function createTeamHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, description } = req.body;

  const createdDeprtment = await getDatabase()?.insertTeam(name, description);

  if (!createdDeprtment) {
    return next(new Error('unable to create department'));
  }

  return res.status(201).json(createdDeprtment);
}

export const createTeam = [
  stringValidator({ field: 'name', maxLength: 64 }),
  stringValidator({
    field: 'description',
    valueRequired: false,
    maxLength: 1000,
  }),
  teamDoesNotExistValidator,
  xssSanitizer('title'),
  xssSanitizer('description'),
  validationCheck,
  genericSanitizer('title'),
  genericSanitizer('description'),
  createTeamHandler,
];

export async function getTeam(req: Request, res: Response) {
  const team = await getDatabase()?.getTeam(req.params.slug);

  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  return res.json(team);
}

export async function updateteamHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { slug } = req.params;
  const team = await await getDatabase()?.getTeam(slug);

  if (!team) {
    return next();
  }

  const { name, description } = req.body;

  const fields = [
    typeof name === 'string' && name ? 'name' : null,
    typeof name === 'string' && name ? 'slug' : null,
    typeof description === 'string' && description ? 'description' : null,
  ];

  const values = [
    typeof name === 'string' && name ? name : null,
    typeof name === 'string' && name ? slugify(name).toLowerCase() : null,
    typeof description === 'string' && description ? description : null,
  ];

  const updated = await getDatabase()?.conditionalUpdate(
    'teams',
    team.id,
    fields,
    values,
  );

  if (!updated) {
    return next(new Error('unable to update team'));
  }

  const updatedteam = updated.rows[0];
  return res.json(updatedteam);
}

export const updateTeam = [
  stringValidator({ field: 'name', maxLength: 64, optional: true }),
  stringValidator({
    field: 'description',
    valueRequired: false,
    maxLength: 1000,
    optional: true,
  }),
  atLeastOneBodyValueValidator(['name', 'description']),
  xssSanitizer('name'),
  xssSanitizer('description'),
  validationCheck,
  updateteamHandler,
];

export async function deleteTeam(req: Request, res: Response) {
  const deletedTeam = await getDatabase()?.deleteTeam(req.params.slug);

  if (!deletedTeam) {
    return res.status(500).json({ error: 'Could not delete team' });
  }

  return res.json(deletedTeam);
}
