import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService extends NestConfigService {
  constructor() {
    const env = process.env.NODE_ENV || 'development';
    const envFile = `.env.${env}`;
    const config = dotenv.parse(fs.readFileSync(envFile));
    super({ envFilePath: envFile, isGlobal: true, load: [() => config] });
  }
}
