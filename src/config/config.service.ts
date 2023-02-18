import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService extends NestConfigService {
  constructor() {
    const env = process.env.NODE_ENV;
    let envFile;
    env !== undefined ? (envFile = `.env.${env}`) : (envFile = '.env');

    const config = dotenv.parse(fs.readFileSync(envFile));
    super({ envFilePath: envFile, isGlobal: true, load: [() => config] });
  }
}
