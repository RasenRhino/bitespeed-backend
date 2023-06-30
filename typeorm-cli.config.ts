import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Identity } from './src/modules/identity/entities/identity.entity';
config({
  path: '.env',
});

const configService = new ConfigService({ path: '.env' });

export default new DataSource({
  type: 'mysql',
  host: configService.get<string>('TYPEORM_HOST'),
  username: configService.get<string>('TYPEORM_USERNAME'),
  password: configService.get<string>('TYPEORM_PASSWORD'),
  database: configService.get<string>('TYPEORM_DATABASE'),
  port: configService.get<number>('TYPEORM_PORT'),
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [Identity],
  migrations: ['./1688121066820-update-tables.ts'],
  subscribers: ['dist/subscriber/**/*.js'],
});
