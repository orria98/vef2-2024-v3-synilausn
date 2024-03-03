/**
 * "Static notendagrunnur"
 * Notendur eru harðkóðaðir og ekkert hægt að breyta þeim.
 * Ef við notum notendagagnagrunn, t.d. í postgres, útfærum við leit að notendum
 * hér, ásamt því að passa upp á að lykilorð séu lögleg.
 */

import bcrypt from 'bcrypt';
import { USERS } from '../users.js';

/**
 * @typedef User
 * @property {string} id
 * @property {string} username
 * @property {string} name
 * @property {string} password
 */

// TODO this should be in a database
const records = USERS;

/**
 * Compare a password to a user's password.
 * @param {string} password Password to compare.
 * @param {User} user User to compare with.
 * @returns {Promise<User | null>} User or null if not same passwords.
 */
export async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password, user.password);

  if (ok) {
    return user;
  }

  return null;
}

// Merkjum sem async þó ekki verið að nota await, þar sem þetta er notað í
// app.js gerir ráð fyrir async falli
export async function findByUsername(username) {
  const found = records.find((u) => u.username === username);

  if (found) {
    return found;
  }

  return null;
}

/**
 * Find a user by ID.
 * @param {string} id User id.
 * @returns {Promise<User | null>} User or null if not found.
 */
export async function findById(id) {
  const found = records.find((u) => u.id === id);

  if (found) {
    return found;
  }

  return null;
}

/**
 * Deserialize user from session based on user id.
 * @param {string} id ID of the user.
 * @param {(err: any | null, user?: User | null) => void} done Callback function.
 * @returns {Promise<void>}
 */
export async function deserializeUser(id, done) {
  try {
    const user = await findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
}

/**
 * Serialize user to session based on user id.
 * @param {any} user User to serialize.
 * @param {(err: any | null, id?: string) => void} done Callback function.
 */
export function serializeUser(user, done) {
  // user typed as any because of passport
  done(null, user.id.toString());
}

/**
 * Athugar hvort username og password sé til í notandakerfi.
 * Callback tekur við villu sem fyrsta argument, annað argument er
 * - `false` ef notandi ekki til eða lykilorð vitlaust
 * - Notandahlutur ef rétt
 *
 * @param {string} username Notandanafn til að athuga
 * @param {string} password Lykilorð til að athuga
 * @param {function} done Fall sem kallað er í með niðurstöðu
 */
export async function localUserStrategy(username, password, done) {
  try {
    const user = await findByUsername(username);
    if (!user) {
      return done(null, false);
    }

    const result = await comparePasswords(password, user);
    return done(null, result);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
export function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}
