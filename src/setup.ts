import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Database } from './lib/db.js';
import { environment } from './lib/environment.js';
import { readFilesFromDir } from './lib/file.js';
import { ILogger, logger as loggerSingleton } from './lib/logger.js';
import { parseGamedayFile, parseTeamsJson } from './lib/parse.js';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';
const INSERT_FILE = './sql/insert.sql';
const INPUT_DIR = './data';

async function setupDbFromFiles(
  db: Database,
  logger: ILogger,
): Promise<boolean> {
  const dropScript = await readFile(DROP_SCHEMA_FILE);
  const createScript = await readFile(SCHEMA_FILE);
  const insertScript = await readFile(INSERT_FILE);

  if (await db.query(dropScript.toString('utf-8'))) {
    logger.info('schema dropped');
  } else {
    logger.info('schema not dropped, exiting');
    return false;
  }

  if (await db.query(createScript.toString('utf-8'))) {
    logger.info('schema created');
  } else {
    logger.info('schema not created');
    return false;
  }

  if (await db.query(insertScript.toString('utf-8'))) {
    logger.info('data inserted');
  } else {
    logger.info('data not inserted');
    return false;
  }

  return true;
}

async function setupData(db: Database, logger: ILogger) {
  const teamsFileData = await readFile(join(INPUT_DIR, 'teams.json'));
  const teams = parseTeamsJson(teamsFileData.toString('utf-8'));
  logger.info('team names read', { total: teams.length });

  const files = await readFilesFromDir(INPUT_DIR);
  const gamedayFiles = files.filter((file) => file.indexOf('gameday-') > 0);
  logger.info('gameday files found', { total: gamedayFiles.length });

  const gamedays = [];
  logger.info('starting to parse gameday files');
  for await (const gamedayFile of gamedayFiles) {
    const file = await readFile(gamedayFile);

    try {
      gamedays.push(parseGamedayFile(file.toString('utf-8'), logger, teams));
    } catch (e) {
      logger.error(`unable to parse ${gamedayFile}`, {
        error: (e as Error).message,
      });
    }
  }
  logger.info('gameday files parsed', { total: gamedays.length });

  const dbTeams = await db.insertTeams(teams);
  logger.info('teams inserted', { total: dbTeams.length });

  const dbGamedays = await db.insertGamedays(gamedays, dbTeams);

  if (!dbGamedays) {
    logger.info('error inserting gamedays');
    return false;
  }

  logger.info('gamedays inserted');

  return true;
}

async function create() {
  const logger = loggerSingleton;
  const env = environment(process.env, logger);

  if (!env) {
    process.exit(1);
  }

  logger.info('starting setup');

  const db = new Database(env.connectionString, logger);
  db.open();

  const resultFromFileSetup = await setupDbFromFiles(db, logger);

  if (!resultFromFileSetup) {
    logger.info('error setting up database from files');
    process.exit(1);
  }

  let resultFromReadingData;
  try {
    resultFromReadingData = await setupData(db, logger);
  } catch (e) {
    // falls through
  }

  if (!resultFromReadingData) {
    logger.info('error reading data from files');
    process.exit(1);
  }

  logger.info('setup complete');
  await db.close();
}

create().catch((err) => {
  console.error('error running setup', err);
});
