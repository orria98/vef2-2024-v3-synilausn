import { ILogger } from './logger.js';

import dotenv from 'dotenv';
dotenv.config();

/** Default port if none provided. */
const DEFAULT_PORT = 3000;

export type Environment = {
  port: number;
  connectionString: string;
};

let parsedEnv: Environment | null = null;

/**
 * Validate the environment variables and return them as an object or `null` if
 * validation fails.
 */
export function environment(
  env: typeof process.env,
  logger: ILogger,
): Environment | null {
  // If we've already parsed the environment, return the cached value
  // i.e. this is singleton and can be called multiple times in different files
  if (parsedEnv) {
    return parsedEnv;
  }

  const { PORT: port, DATABASE_URL: envConnectionString } = env;

  let error = false;

  if (!envConnectionString || envConnectionString.length === 0) {
    logger.error('DATABASE_URL must be defined as a string');
    error = true;
  }

  let usedPort;
  const parsedPort = Number.parseInt(port ?? '', 10);
  if (port && Number.isNaN(parsedPort)) {
    logger.error('PORT must be defined as a number', port);
    usedPort = parsedPort;
    error = true;
  } else if (parsedPort) {
    usedPort = parsedPort;
  } else {
    logger.info('PORT not defined, using default port', DEFAULT_PORT);
    usedPort = DEFAULT_PORT;
  }

  if (error) {
    return null;
  }

  // We know these are defined because we checked above
  const connectionString = envConnectionString!;

  parsedEnv = {
    port: usedPort,
    connectionString,
  };

  return parsedEnv;
}
