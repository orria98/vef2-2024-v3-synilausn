import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import slugify from 'slugify';
import xss from 'xss';
import { getDatabase } from './db.js';

export function createGameValidationMiddleware() {
  return [
    // format should be like 2024-02-11T19:01
    body('date')
      .trim()
      .custom((value) => {
        const date = new Date(value);
        return !Number.isNaN(date.getTime());
      })
      .withMessage('Dagsetning verður að vera gild'),
    body('home').custom((value, { req }) => {
      if (value === req.body.away) {
        throw new Error('Heimalið og útilið verða að vera mismunandi');
      }
      return true;
    }),
    body('home').custom(async (value) => {
      const teams = (await getDatabase()?.getTeams()) ?? [];

      if (!teams.find((t) => t.id.toString() === value)) {
        throw new Error('Heimalið verður að vera gilt');
      }
      return true;
    }),
    body('away').custom(async (value) => {
      const teams = (await getDatabase()?.getTeams()) ?? [];
      console.log(value, teams);
      if (!teams.find((t) => t.id.toString() === value)) {
        throw new Error('Útilið verður að vera gilt');
      }
      return true;
    }),
    body('home_score')
      .isInt({ min: 0, max: 99 })
      .withMessage(
        'Stig heimaliðs verður að vera heiltala, 0 eða stærri, hámark 99',
      ),
    body('away_score')
      .isInt({ min: 0, max: 99 })
      .withMessage(
        'Stig útiliðs verður að vera heiltala, 0 eða stærri, hámark 99',
      ),
  ];
}

// Viljum keyra sér og með validation, ver gegn „self XSS“
export function xssSanitizationMiddleware() {
  return [
    body('date').customSanitizer((v) => xss(v)),
    body('home').customSanitizer((v) => xss(v)),
    body('away').customSanitizer((v) => xss(v)),
    body('home_score').customSanitizer((v) => xss(v)),
    body('away_score').customSanitizer((v) => xss(v)),
  ];
}

export function sanitizationMiddleware() {
  return [
    body('date').trim().escape(),
    body('home').trim().escape(),
    body('away').trim().escape(),
    body('home_score').trim().escape(),
    body('away_score').trim().escape(),
  ];
}

export const stringValidator = ({
  field = '',
  valueRequired = true,
  maxLength = 0,
  optional = false,
} = {}) => {
  const val = body(field)
    .trim()
    .isString()
    .isLength({
      min: valueRequired ? 1 : undefined,
      max: maxLength ? maxLength : undefined,
    })
    .withMessage(
      [
        field,
        valueRequired ? 'required' : '',
        maxLength ? `max ${maxLength} characters` : '',
      ]
        .filter((i) => Boolean(i))
        .join(' '),
    );

  if (optional) {
    return val.optional();
  }
  return val;
};

export const xssSanitizer = (param: string) =>
  body(param).customSanitizer((v) => xss(v));

export const xssSanitizerMany = (params: string[]) =>
  params.map((param) => xssSanitizer(param));

export const genericSanitizer = (param: string) => body(param).trim().escape();

export const genericSanitizerMany = (params: string[]) =>
  params.map((param) => genericSanitizer(param));

/**
 * Checks to see if there are validation errors or returns next middlware if not.
 * @param req HTTP request
 * @param res HTTP response
 * @param next Next middleware
 * @returns Next middleware or validation errors.
 */
export function validationCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const errors = validation.array();
    const notFoundError = errors.find((error) => error.msg === 'not found');
    const serverError = errors.find((error) => error.msg === 'server error');

    let status = 400;

    if (serverError) {
      status = 500;
    } else if (notFoundError) {
      status = 404;
    }

    return res.status(status).json({ errors });
  }

  return next();
}

export const teamDoesNotExistValidator = body('name').custom(async (name) => {
  if (await await getDatabase()?.getTeam(slugify(name))) {
    return Promise.reject(new Error('team with name already exists'));
  }
  return Promise.resolve();
});

export function atLeastOneBodyValueValidator(fields: Array<string>) {
  return body().custom(async (value, { req }) => {
    const { body: reqBody } = req;

    let valid = false;

    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i];

      if (field in reqBody && reqBody[field] != null) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return Promise.reject(
        new Error(`require at least one value of: ${fields.join(', ')}`),
      );
    }
    return Promise.resolve();
  });
}
