import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  DatabaseConfig,
  DatabaseConfigReader,
  DatabaseEnv,
} from './database.types';

const REQUIRED_DATABASE_VARS = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
] as const;

function readValue(source: DatabaseConfigReader, key: keyof DatabaseEnv): string | undefined {
  return source.get(key);
}

function parsePort(rawPort: string): number {
  const port = Number.parseInt(rawPort, 10);

  if (Number.isNaN(port)) {
    throw new Error(`Invalid DB_PORT value "${rawPort}". Expected a number.`);
  }

  return port;
}

function parseSsl(rawSsl: string | undefined): boolean {
  return rawSsl === 'true' || rawSsl === '1';
}

export function readDatabaseConfigFromSource(
  source: DatabaseConfigReader,
): DatabaseConfig {
  for (const key of REQUIRED_DATABASE_VARS) {
    if (!readValue(source, key)) {
      throw new Error(`Missing required database environment variable: ${key}`);
    }
  }

  return {
    host: readValue(source, 'DB_HOST')!,
    port: parsePort(readValue(source, 'DB_PORT')!),
    user: readValue(source, 'DB_USER')!,
    password: readValue(source, 'DB_PASSWORD')!,
    database: readValue(source, 'DB_NAME')!,
    ssl: parseSsl(readValue(source, 'DB_SSL')),
  };
}

export function createDatabaseConfig(configService: ConfigService): DatabaseConfig {
  return readDatabaseConfigFromSource(configService);
}

export function readDatabaseConfig(env: DatabaseEnv = process.env): DatabaseConfig {
  return readDatabaseConfigFromSource({
    get(propertyPath: string): string | undefined {
      return env[propertyPath as keyof DatabaseEnv];
    },
  });
}

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): DatabaseConfig {
    return createDatabaseConfig(this.configService);
  }
}
